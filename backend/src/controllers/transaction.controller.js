import mongoose from "mongoose";
import transactionModel from "../models/transaction.model.js";

/**
 * Create Transaction
 */
export async function createTransaction(req, res) {
    const { title, amount, type, category, description } = req.body;

    try {
        const transaction = await transactionModel.create({
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

        const transactions = await transactionModel
            .find({ companyId: req.user.companyId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
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