import { Router } from "express"
import { verifyToken } from "./verify-token.js"
import { getZones, postZone, getDirectories, postDirectory, uploadFile, getDirectoryFiles, getFile, getZoneDirectories } from "../controllers/files.controller.js";
const router = Router()
router.get('/zones',verifyToken, getZones)
router.post('/zones', verifyToken, postZone)
router.get('/directories', verifyToken, getDirectories)
router.post('/directories', verifyToken, postDirectory)
router.post('/files', verifyToken, uploadFile)
router.get('/files/:file', verifyToken, getFile)
router.get('/zones/:zone/directories', verifyToken, getZoneDirectories)
router.get('/directories/:directory/files', verifyToken, getDirectoryFiles)
export default router;