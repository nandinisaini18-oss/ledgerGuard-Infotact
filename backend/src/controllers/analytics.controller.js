import companyModel from "../models/company.model.js";
import redisClient from "../config/redis.js";
import { getTenantConnection } from "../database/tenantConnection.js";
import { getTransactionModel } from "../models/tenantTransaction.model.js";

export async function getCategoryAnalytics(req, res) {
    try {
        const cacheKey = `category:${req.user.companyId}`;

        const cachedData = await redisClient.get(cacheKey);

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

        await redisClient.set(
            cacheKey,
            JSON.stringify(categories),
            {
                EX: 300
            }
        );

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

export async function getTransactionSummary(req, res) {
    try {

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

        const cacheKey = `summary:${req.user.companyId}`;

        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return res.status(200).json({
                success: true,
                ...JSON.parse(cachedData),
                cached: true
            });
        }

        const result = {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };

        await redisClient.set(
            cacheKey,
            JSON.stringify(result),
            {
                EX: 300
            }
        );

        return res.status(200).json({
            success: true,
            ...result
        });

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

        return res.status(200).json({
            success: true,
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}