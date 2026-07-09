import { Router } from "express"
import { registerUser , loginUser , getUser , logOutUser} from "../controllers/auth.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"

const authRouter = Router()

// authRouter.post("/api/auth/user/register")
authRouter.post("/register" , registerUser)

authRouter.post("/login" , loginUser)

authRouter.get("/get-me" , authenticateUser , getUser)

authRouter.post("/logout", authenticateUser, logOutUser);


export default authRouter