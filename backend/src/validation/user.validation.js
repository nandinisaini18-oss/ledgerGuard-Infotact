import { body } from "express-validator";

export const createUserValidation = [
    body("fullname")
        .trim()
        .notEmpty().withMessage("fullname can't be empty")
        .isLength({ min: 4 }).withMessage("fullname must be at least 4 characters"),

    body("email")
        .trim()
        .notEmpty().withMessage("email can't be empty")
        .isEmail().withMessage("email must be a valid email"),

    body("password")
        .trim()
        .notEmpty().withMessage("password can't be empty")
        .isLength({ min: 6 }).withMessage("password must be at least 6 characters"),

    body("role")
        .optional()
        .isIn(["admin", "user"]).withMessage("Invalid role"),
];

export const updateUserValidation = [
    body("fullname")
        .optional()
        .trim()
        .notEmpty().withMessage("fullname can't be empty")
        .isLength({ min: 4 }).withMessage("fullname must be at least 4 characters"),

    body("email")
        .optional()
        .trim()
        .notEmpty().withMessage("email can't be empty")
        .isEmail().withMessage("email must be a valid email"),
];

export const updateUserRoleValidation = [
    body("role")
        .notEmpty().withMessage("Role is required")
        .isIn(["admin", "user"]).withMessage("Invalid role"),
];
