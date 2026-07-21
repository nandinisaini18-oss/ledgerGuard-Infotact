import { Router } from "express";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware.js";

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
import { distributedLock } from "../middlewares/distributedLock.middleware.js";

const transactionRouter = Router();

transactionRouter.post(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    distributedLock,
    idempotencyMiddleware,
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
    authorizeRoles("admin"),
    transactionValidation,
    validate,
    updateTransaction
);

transactionRouter.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("admin"),
    deleteTransaction
);

export default transactionRouter;