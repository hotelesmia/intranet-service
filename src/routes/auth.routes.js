import { Router } from "express"
import { login } from "../controllers/auth.controller.js"
const router = Router()

router.post("/auth/login", login)

//router.post("auth/reset-password", function())

//router.post("auth/change-password", function())

export default router;