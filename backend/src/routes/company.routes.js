import { Router } from "express"
import { registerCompany} from "../controllers/company.controller.js"
import { validate } from "../middlewares/validate.middleware.js"
import { companyValidation } from "../validation/company.validation.js"

const companyRouter = Router()

// authRouter.post("/api/auth/company/register")
companyRouter.post("/register" , companyValidation , validate , registerCompany)

export default companyRouter