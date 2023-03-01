import { Router } from "express"
import { getZones, postZone, getDirectories, postDirectory, uploadFile, getDirectoryFiles } from "../controllers/files.controller.js";
const router = Router()

router.get('/zones', getZones)
router.post('/zones', postZone)
router.get('/directories', getDirectories)
router.post('/directories', postDirectory)
router.post('/files', uploadFile)
router.get('/directories/:directory/files', getDirectoryFiles)


export default router;