import {body} from "express-validator"

// fullname , email , password , role 

export const registerValidation = [
    body("fullname")
    .trim()
    .notEmpty().withMessage("fullname can't be empty")
    .isLength({min : 4}).withMessage("fullname must be 4 characters long"),

    body("email")
    .trim()
    .notEmpty().withMessage("email can't be empty")
    .isEmail().withMessage("email must be a valid email"),

    body("password")
    .trim()
    .notEmpty().withMessage("password can't be empty")
    .isLength({min : 6}).withMessage("password must be 6 characters long"),

    body("companyId")
    .notEmpty().withMessage("Company ID is required")
    .isMongoId().withMessage("Invalid Company ID"),

    body("role")
    .optional()
    .isIn(["admin","user"])

]

export const loginValidation = [
    body("email")
    .trim()
    .notEmpty().withMessage("email can't be empty")
    .isEmail().withMessage("email must be a valid email"),

    body("password")
    .trim()
    .notEmpty().withMessage("password can't be empty")
    .isLength({min : 6}).withMessage("password must be 6 characters long"),
]