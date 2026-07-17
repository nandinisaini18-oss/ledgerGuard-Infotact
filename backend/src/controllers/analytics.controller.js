import transactionModel from "../models/transaction.model.js";

export async function getCategoryAnalytics(req, res) {
    try {

        const categories = await transactionModel.aggregate([
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

        const summary = await transactionModel.aggregate([
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