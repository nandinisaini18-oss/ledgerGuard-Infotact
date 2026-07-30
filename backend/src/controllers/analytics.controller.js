import companyModel from "../models/company.model.js";
import redisClient from "../config/redis.js";
import { getTenantConnection } from "../database/tenantConnection.js";
import { getTransactionModel } from "../models/tenantTransaction.model.js";

export async function getCategoryAnalytics(req, res) {
    try {
        const cacheKey = `category:${req.user.companyId}`;

        let cachedData = null;
        try {
            cachedData = await redisClient.get(cacheKey);
        } catch {
            // Redis unavailable — skip cache
        }

        if (cachedData) {
            return res.status(200).json({
                success: true,
                categories: JSON.parse(cachedData),
                cached: true
            });
        }

        const company = await companyModel.findById(req.user.companyId);

        const connection = getTenantConnection(company.databaseName);

        const Transaction = getTransactionModel(connection);

        const categories = await Transaction.aggregate([
            {
                $match: {
                    companyId: req.user.companyId
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $sort: {
                    totalAmount: -1
                }
            }
        ]);

        try {
            await redisClient.set(
                cacheKey,
                JSON.stringify(categories),
                {
                    EX: 300
                }
            );
        } catch {
            // Redis unavailable — skip caching
        }

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (err) {
        console.error("getCategoryAnalytics error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getTransactionSummary(req, res) {
    try {

        const cacheKey = `summary:${req.user.companyId}`;

        let cachedData = null;
        try {
            cachedData = await redisClient.get(cacheKey);
        } catch {
            // Redis unavailable — skip cache
        }

        if (cachedData) {
            return res.status(200).json({
                success: true,
                ...JSON.parse(cachedData),
                cached: true
            });
        }

        const company = await companyModel.findById(req.user.companyId);

        const connection = getTenantConnection(company.databaseName);

        const Transaction = getTransactionModel(connection);

        const summary = await Transaction.aggregate([
            {
                $match: {
                    companyId: req.user.companyId
                }
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach(item => {
            if (item._id === "income") {
                totalIncome = item.totalAmount;
            }

            if (item._id === "expense") {
                totalExpense = item.totalAmount;
            }
        });

        const result = {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };

        try {
            await redisClient.set(
                cacheKey,
                JSON.stringify(result),
                {
                    EX: 300
                }
            );
        } catch {
            // Redis unavailable — skip caching
        }

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (err) {
        console.error("getTransactionSummary error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}