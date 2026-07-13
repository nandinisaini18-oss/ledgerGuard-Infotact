import { Router } from "express";

import {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction
} from "../controllers/transaction.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { transactionValidation } from "../validation/transaction.validation.js";

const transactionRouter = Router();

transactionRouter.post(
    "/",
    authenticateUser,
    transactionValidation,
    validate,
    createTransaction
);

transactionRouter.get(
    "/",
    authenticateUser,
    getTransactions
);

transactionRouter.get(
    "/:id",
    authenticateUser,
    getTransaction
);

transactionRouter.put(
    "/:id",
    authenticateUser,
    transactionValidation,
    validate,
    updateTransaction
);

transactionRouter.delete(
    "/:id",
    authenticateUser,
    deleteTransaction
);

export default transactionRouter;