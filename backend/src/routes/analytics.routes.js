import { Router } from "express";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
    getTransactionSummary,
    getCategoryAnalytics,
    getTrends,
} from "../controllers/analytics.controller.js";

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

analyticsRouter.get(
    "/trends",
    authenticateUser,
    getTrends
);

export default analyticsRouter;