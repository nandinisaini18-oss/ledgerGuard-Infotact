import { Router } from "express"
import { registerUser } from "../controllers/auth.controller.js"

const authRouter = Router()

// authRouter.post("/api/auth/user/register")
authRouter.post("/register" , registerUser)


export default authRouter