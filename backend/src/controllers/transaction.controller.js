import mongoose from "mongoose";
import transactionModel from "../models/transaction.model.js";
import companyModel from "../models/company.model.js";
import { getTenantConnection } from "../database/tenantConnection.js";
import { getTransactionModel } from "../models/tenantTransaction.model.js";


/**
 * Create Transaction
 */
export async function createTransaction(req, res) {
    const { title, amount, type, category, description } = req.body;

    try {
        const company = await companyModel.findById(req.user.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const connection = getTenantConnection(company.databaseName);

        const Transaction = getTransactionModel(connection);

        const transaction = await Transaction.create({
            title,
            amount,
            type,
            category,
            description,
            companyId: req.user.companyId,
            createdBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

/**
 * Get All Transactions
 */
export async function getTransactions(req, res) {
    try {

        // Read page and limit from query parameters
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const { type, category, search, sort } = req.query;

        const filter = {
            companyId: req.user.companyId
        };

        let sortOption = {
            createdAt: -1
        };

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }

        if (search) {
        filter.title = {
            $regex: search,
            $options: "i"
        };
    }

        if (sort === "amount") {
            sortOption = { amount: 1 };
        }

        if (sort === "-amount") {
            sortOption = { amount: -1 };
        }

        if (sort === "createdAt") {
            sortOption = { createdAt: 1 };
        }

        if (sort === "-createdAt") {
            sortOption = { createdAt: -1 };
        }
        // Calculate how many documents to skip
        const skip = (page - 1) * limit;

        // Count total transactions for this company
        const totalTransactions = await transactionModel.countDocuments(filter);

        // Fetch paginated transactions
        const transactions = await transactionModel
            .find(filter)
            .populate("createdBy", "fullname email role")
            .populate("companyId", "companyName companyEmail subscriptionPlan")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        // Calculate total pages
        const totalPages = Math.ceil(totalTransactions / limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalTransactions,
            totalPages,
            count: transactions.length,
            transactions
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}

/**
 * Get Single Transaction
 */

export async function getTransaction(req, res) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction id"
            });
        }

        const transaction = await transactionModel
            .findById(id)
            .populate("createdBy", "fullname email role")
            .populate("companyId", "companyName companyEmail subscriptionPlan");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transaction.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        return res.status(200).json({
            success: true,
            transaction
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


/**
 * Update Transaction
 */
export async function updateTransaction(req, res) {

    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction id"
            });
        }

        const transaction = await transactionModel.findById(id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transaction.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        transaction.title = req.body.title ?? transaction.title;
        transaction.amount = req.body.amount ?? transaction.amount;
        transaction.type = req.body.type ?? transaction.type;
        transaction.category = req.body.category ?? transaction.category;
        transaction.description = req.body.description ?? transaction.description;

        await transaction.save();

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

}


/**
 * Delete Transaction
 */
export async function deleteTransaction(req, res) {

    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction id"
            });
        }

        const transaction = await transactionModel.findById(id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transaction.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        await transaction.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

}