import { body} from "express-validator";

export const companyValidation = [
    body("companyName")
        .trim()
        .notEmpty().withMessage("Company name is required")
        .isLength({ min: 3 }).withMessage("Company name must be at least 3 characters"),

    body("companyEmail")
        .trim()
        .notEmpty().withMessage("Company email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("subscriptionPlan")
        .optional()
        .isIn(["basic", "pro", "enterprise"])
        .withMessage("Invalid subscription plan"),

];

export const updateCompanyValidation = [
    body("companyName")
        .optional()
        .trim()
        .notEmpty().withMessage("Company name is required")
        .isLength({ min: 3 }).withMessage("Company name must be at least 3 characters"),

    body("companyEmail")
        .optional()
        .trim()
        .notEmpty().withMessage("Company email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("subscriptionPlan")
        .optional()
        .isIn(["basic", "pro", "enterprise"])
        .withMessage("Invalid subscription plan"),

    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Invalid status"),

];