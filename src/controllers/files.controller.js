import S3Service from "../services/s3.service.js"
import formidable from "formidable"
import * as fs from "node:fs"
import config from "../config.js"
import model from "../database/models/index.js"
import crypto from "crypto"
import { logActivity } from "./log.controller.js"
import { Op } from "sequelize"

export const getZones = async (req, res) => {
    const zones = await model.zones.findAll({
        attributes: ['id', 'uuid', 'key', 'description']
    })
    return res.send({ data: { zones } })
}

const getZoneByKey = async (key) => {
    const zone = await model.zones.findOne({
        attributes: ['id', 'key', 'description'],
        where: { 'uuid': key }
    })
    return zone
}

export const postZone = async (req, res) => {
    try {
        const { key, description } = req.body
        const zone = await model.zones.create({
            uuid: crypto.randomUUID(),
            key,
            description,
            status: 1
        })
        res.status(201)
        return res.send({ zone })
    } catch (error) {
        return res.send(400)
    }
}

export const postDirectory = async (req, res) => {
    const t = await model.sequelize.transaction()
    try {
        const { key, zone, name, description } = req.body
        const zoneData = await getZoneByKey(zone)
        const directory = await model.directories.create({
            uuid: crypto.randomUUID(),
            key,
            zoneId: zoneData.id,
            parentDirectory: 0,
            name,
            description,
            commonAccess: 1
        }, { transaction: t })
        await t.commit()
        return res.status(201).send({ data: { directory } })
    } catch (error) {
        console.log(error)
        await t.rollback()
        return res.send(400)
    }
}

export const getDirectories = async (req, res) => {
    try {
        const directories = await model.directories.findAll({
            attributes: ['id', 'uuid', 'zoneId', 'key', 'name', 'description']
        })
        return res.status(200).send({ data: { directories } })
    } catch (error) {
        console.log(error)
        return res.send(400)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @history
 * [efraindiaz] 09-Mar-2023 Se incluye filtro de permisos 
 */
export const getZoneDirectories = async (req, res) => {
    try {
        const sessionUser = req.user
        const zoneUuid = req.params.zone
        const zone = await getZoneByKey(zoneUuid)
        let includeItems = ''
        const permissions = await model.directoryPermissions.findAll({
            where: { allowTo: sessionUser.id },
            attributes: ['directoryId']
        })
        if (permissions.length > 0) {
            includeItems = permissions.map((item) => item.directoryId)
        }
        const directories = await model.directories.findAll({
            order: model.sequelize.literal('`directories`.`id` DESC'),
            attributes: ['id', 'uuid', 'zoneId', 'key', 'name', 'description'],
            where: {
                zoneId: zone.id,
                [Op.or]: [{
                    commonAccess: true
                }, {
                    id: {
                        [Op.in]: includeItems
                    }
                }]
            }
        })
        return res.status(200).send({ data: { directories } })
    } catch (error) {
        console.log(error)
        return res.send(400)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * @history
 * [efraindiaz] 09-03-2023 Se incluye filtro de permisos  
 */
export const getDirectoryFiles = async (req, res) => {
    const sessionUser = req.user
    //Obtenemos el directorio
    const targetDirectory = req.params.directory
    const directory = await model.directories.findOne({
        where: { uuid: targetDirectory }
    })
    let includeItems = ''
    const permissions = await model.masterFilePermissions.findAll({
        where: { allowTo: sessionUser.id },
        attributes: ['masterFileId']
    })
    if (permissions.length > 0) {
        includeItems = permissions.map((item) => item.masterFileId)
    }
    const { rows, count } = await model.masterFiles.findAndCountAll({
        where: {
            parentDirectory: directory.id,
            [Op.or]: [{
                commonAccess: true
            }, {
                id: {
                    [Op.in]: includeItems
                }
            }]
        },
        distinct: true,
        order: model.sequelize.literal('`masterFiles`.`id` DESC, `files`.`id` DESC'),
        include: {
            model: model.files,
        }
    })

    return res.send({ data: { masterFiles: rows, count } })
}

export const getFile = async (req, res) => {
    const key = req.params.file
    const file = await model.masterFiles.findOne({
        where: { 'uuid': key },
        include: {
            model: model.files,
            separate: true,
            order: model.sequelize.literal('`files`.`id` DESC'),
        }
    })
    res.send({ data: { file } })
}

export const uploadFile = async (req, res) => {
    const userSession = req.user
    const t = await model.sequelize.transaction()
    try {
        const form = formidable({
            filter: function ({ name, originalFilename, mimetype }) {
                return isFileValid(mimetype)
            }
        })
        form.parse(req, async (err, fields, files) => {
            if (!files.file) return res.status(400).json({ errorCode: 'file_required' })
            const { directory, masterFile, name, description, tags } = fields
            const file = files.file
            const originalFilename = file.originalFilename.replace(/\s/g, "-")
            const fileName = `${file.newFilename}-${originalFilename}`
            const fileContent = fs.readFileSync(file.filepath)
            //handle file register
            //verificamos existencia del directorio
            const checkDirectoryData = await getDirectoryByKey(directory)
            //Si no existe directorio, terminamos proceso
            if (!checkDirectoryData) return res.status(400).json({ errorCode: 'directory_not_exist' })
            //seteamos fileKey AWS con folder actual
            const fileKey = `${config.S3_FILES_SRC}${checkDirectoryData.key}/${fileName}`
            //verificamos exisitencia del archivo principal
            let masterFileItem = await getMasterFileByKey(masterFile)
            if (!masterFileItem) {
                masterFileItem = await model.masterFiles.create({
                    uuid: crypto.randomUUID(),
                    parentDirectory: checkDirectoryData.id,
                    name,
                    description,
                    order: 0,
                    status: 1,
                    createdBy: userSession?.identity,
                    commonAccess: 1
                }, { transaction: t })
            }
            //Si existe archivo principal, solo generamos versionado
            const fileItem = await model.files.create({
                uuid: crypto.randomUUID(),
                masterFileId: masterFileItem.id,
                name: name,
                description: description,
                key: fileName,
                fullKey: fileKey,
                type: getFileExtension(fileName),
                status: 1,
                createdBy: userSession?.identity

            }, { transaction: t })
            //Generamos tags del archivo
            //await createFileTags(fileItem.id, tags)
            //file upload section                        
            const s3Upload = await S3Service.upload(fileKey, fileContent)
            if (!s3Upload) {
                await t.rollback()
                return res.send(400)
            }
            await t.commit()
            await logActivity({ 'createdBy': userSession?.identity, 'target': 'files', 'targetId': fileItem.id, action: 'create', value: JSON.stringify(fileItem) })
            const masterFileCreated = await getMasterFilesByKey(masterFileItem.uuid)
            return res.send({ data: { masterFile: masterFileCreated } })
        })
    } catch (error) {
        console.log(error)
        await t.rollback()
        return res.send(400)
    }
}

export const downloadFile = async (req, res) => {
    const fileUuid = req.params.file
    //Get full key
    const fileData = await model.files.findOne({
        where: { uuid: fileUuid }
    })
    //Download file from AWS S3                                   
    const download = await S3Service.download(fileData.fullKey)
        .then(function (data) {
            //res.attachment(fileData.key); // Set Filename
            res.send(data)
            res.end()
        })
}

const getDirectoryByKey = async (key) => {
    try {
        return await model.directories.findOne({
            where: { 'uuid': key },
            attributes: ['id', 'uuid', 'key']
        })
    } catch (error) {
        return false
    }
}

const getMasterFileByKey = async (key) => {
    try {
        return await model.masterFiles.findOne({
            where: { 'uuid': key },
            attributes: ['id', 'uuid', 'name']
        })
    } catch (error) {
        return false
    }
}

const createFileTags = async (fileId, items) => {
    try {
        if (items.trim() !== "") {
            const arrayItems = items.split(",")
            let tags = []
            if (arrayItems) {
                tags = arrayItems.map(function (item) {
                    return {
                        fileId,
                        tag: item,
                        status: 1
                    }
                })
                return await model.fileTags.bulkCreate(tags)
            }
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const isFileValid = (mimetype) => {
    console.log(mimetype)
    const type = mimetype.split("/").pop();
    const validTypes = ["msword", "vnd.ms-excel", "xlsx", "pdf",
        "x-pdf", "csv",
        "vnd.ms-powerpoint",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "vnd.openxmlformats-officedocument.presentationml.presentation"]
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
}

const getFileExtension = (path) => {
    try {
        let basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
            // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return ""                              //  `.` not found (-1) or comes first (0)
        return basename.slice(pos + 1);            // extract extension ignoring `.`
    } catch (error) {
        return ""
    }
}

const getMasterFilesByKey = async (key) => {
    const masterFile = await model.masterFiles.findOne({
        where: { 'uuid': key },
        include: {
            model: model.files,
            separate: true,
            order: model.sequelize.literal('`files`.`id` DESC'),
        }
    })
    return masterFile
}

