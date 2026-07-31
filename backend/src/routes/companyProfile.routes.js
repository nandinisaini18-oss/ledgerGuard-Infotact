import { Router } from "express"
import { getCompanyProfile, updateCompanyProfile } from "../controllers/company.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { updateCompanyProfileValidation } from "../validation/company.validation.js"

const companyProfileRouter = Router()

// GET /api/company/profile
companyProfileRouter.get("/profile" , authenticateUser , getCompanyProfile)

// PUT /api/company/profile
companyProfileRouter.put(
    "/profile",
    authenticateUser,
    authorizeRoles("admin"),
    updateCompanyProfileValidation,
    validate,
    updateCompanyProfile
)

export default companyProfileRouter
