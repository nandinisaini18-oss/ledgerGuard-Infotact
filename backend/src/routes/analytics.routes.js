import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getTransactionSummary } from "../controllers/analytics.controller.js";
import { getCategoryAnalytics } from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

analyticsRouter.get(
    "/category",
    authenticateUser,
    getCategoryAnalytics
);

analyticsRouter.get(
    "/summary",
    authenticateUser,
    getTransactionSummary
);

export default analyticsRouter;