import S3Service from "../services/s3.service.js"
import formidable from "formidable"
import * as fs from "node:fs"
import config from "../config.js"
import model from "../database/models/index.js"
import crypto from "crypto"

export const getZones = async (req, res) => {
    const zones = await model.zones.findAll({
        attributes: ['id', 'key', 'description']
    })
    const directory = await getDirectoryByKey('85db88f3-487e-44a7-ab05-59809d4f79ad')
    console.log(directory)
    return res.send({ zones, resp: directory ? directory : 'no hay' })
}

const getZoneByKey = async (key) => {
    const zone = await model.zones.findAll({
        attributes: ['id', 'key', 'description'],
        where: { 'key': key }
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
            zone: zoneData.id,
            parentDirectory: 0,
            name,
            description
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
            attributes: ['id', 'key', 'name', 'description']
        })
        return res.status(200).send({ data: { directories } })
    } catch (error) {
        console.log(error)
        return res.send(400)
    }
}

export const getDirectoryFiles = async (req, res) => {

    const files = await model.files.findAll({

    })
}

export const uploadFile = async (req, res) => {
    const t = await model.sequelize.transaction()
    try {
        const form = formidable({
            filter: function ({ name, originalFilename, mimetype }) {
                //return mimetype && mimetype.includes("pdf")
                return isFileValid(mimetype)
            }
        })

        form.parse(req, async (err, fields, files) => {
            if (!files.file) return res.status(400).json({ errorCode: 'file_required' })
            const { directory, masterFile, name, description } = fields
            const file = files.file
            const originalFilename = file.originalFilename.replace(/\s/g, "-")
            const fileName = `${file.newFilename}-${originalFilename}`
            const fileContent = fs.readFileSync(file.filepath)
            const fileKey = `${config.S3_FILES_SRC}${fileName}`
            //handle file register
            //verificamos existencia del directorio
            const checkDirectoryData = await getDirectoryByKey(directory)
            if (!checkDirectoryData) return res.status(400).json({ errorCode: 'directory_not_exist' })
            //verificamos exisitencia del archivo principal
            let masterFileItem = await getMasterFileByKey(masterFile)
            if (!masterFileItem) {                
                masterFileItem = await model.masterFiles.create({
                    uuid: crypto.randomUUID(),
                    parentDirectory: 0,
                    name,
                    description,
                    order: 0,
                    status: 1
                }, { transaction: t })
            }
            //Si existe archivo principal, solo generamos versionado
            const fileItem = await model.files.create({
                uuid: crypto.randomUUID(),
                masterFileId: masterFileItem.id,
                name: name,
                key: fileName,
                fullKey: fileKey,
                status: 1

            }, { transaction: t })
            //Generamos tags del archivo

            //Generamos un log

            //file upload section                        
            const s3Upload = await S3Service.upload(fileKey, fileContent)
            s3Upload ? await t.commit() : await t.rollback()

            return res.send({ data: { masterFile } })
        })

    } catch (error) {
        console.log(error)
        await t.rollback()
        return res.send(400)
    }
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