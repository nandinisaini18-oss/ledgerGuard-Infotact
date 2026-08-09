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

export const getTrends = async (req, res) => {
    try {
        const range = req.query.range || "7d";

        let startDate = new Date();
        let groupFormat;

        if (range === "7d" || range === "30d") {
            const days = range === "7d" ? 7 : 30;
            startDate.setDate(startDate.getDate() - days);
            groupFormat = "%Y-%m-%d";
        } else if (range === "12m") {
            startDate.setMonth(startDate.getMonth() - 12);
            groupFormat = "%Y-%m";
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid range. Use 7d, 30d or 12m"
            });
        }

        const company = await companyModel.findById(req.user.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const connection = getTenantConnection(company.databaseName);

        const Transaction = getTransactionModel(connection);

        const trends = await Transaction.aggregate([
            {
                $match: {
                    companyId: req.user.companyId,
                    createdAt: {
                        $gte: startDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: groupFormat,
                            date: "$createdAt"
                        }
                    },
                    income: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "income"] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "expense"] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const data = trends.map(item => {
            let label = item._id;

            if (range === "12m") {
                const [year, month] = item._id.split("-");
                const date = new Date(Number(year), Number(month) - 1, 1);
                label = date.toLocaleString("en-US", {
                    month: "short",
                    year: "numeric"
                });
            } else {
                const [year, month, day] = item._id.split("-");
                const date = new Date(Number(year), Number(month) - 1, Number(day));
                label = date.toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit"
                });
            }

            return {
                label,
                income: item.income,
                expense: item.expense,
                balance: item.income - item.expense
            };
        });

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.error("getTrends error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}