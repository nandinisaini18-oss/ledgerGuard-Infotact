import { Router } from "express"
import { registerUser , loginUser , getUser , logOutUser} from "../controllers/auth.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { registerValidation , loginValidation } from "../validation/auth.validation.js"
import { validate } from "../middlewares/validate.middleware.js"

const authRouter = Router()

// authRouter.post("/api/auth/user/register")
authRouter.post("/register" , registerValidation , validate , registerUser)

authRouter.post("/login" , loginValidation , validate , loginUser)

authRouter.get("/get-me" , authenticateUser , getUser)

authRouter.post("/logout", authenticateUser, logOutUser);


export default authRouter