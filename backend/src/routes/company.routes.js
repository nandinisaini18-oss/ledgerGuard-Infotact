import { Router } from "express"
import { registerCompany } from "../controllers/company.controller.js"

const companyRouter = Router()

// authRouter.post("/api/auth/company/register")
companyRouter.post("/register" , registerCompany)


export default companyRouter