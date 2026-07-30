import { body } from "express-validator";

export const transactionValidation = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),

    body("type")
        .notEmpty().withMessage("Transaction type is required")
        .isIn(["income", "expense"])
        .withMessage("Type must be either 'income' or 'expense'"),

    body("category")
        .trim()
        .notEmpty().withMessage("Category is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Category must be between 2 and 50 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
];

export const updateTransactionValidation = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

    body("amount")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),

    body("type")
        .optional()
        .isIn(["income", "expense"])
        .withMessage("Type must be either 'income' or 'expense'"),

    body("category")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Category must be between 2 and 50 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
];