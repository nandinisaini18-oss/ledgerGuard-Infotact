import { Router } from "express";
import { getCompanies, getCompany, updateCompany, toggleCompanyStatus } from "../controllers/company.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateCompanyValidation } from "../validation/company.validation.js";

const companyListRouter = Router();

// GET /api/companies
companyListRouter.get("/", authenticateUser, authorizeRoles("admin"), getCompanies);

// GET /api/companies/:id
companyListRouter.get("/:id", authenticateUser, authorizeRoles("admin"), getCompany);

// PUT /api/companies/:id
companyListRouter.put("/:id", authenticateUser, authorizeRoles("admin"), updateCompanyValidation, validate, updateCompany);

// PATCH /api/companies/:id/status
companyListRouter.patch("/:id/status", authenticateUser, authorizeRoles("admin"), toggleCompanyStatus);

export default companyListRouter;
