import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

transactionSchema.index({
    companyId: 1
});

// Company + Transaction Type
transactionSchema.index({
    companyId: 1,
    type: 1
});

// Company + Category
transactionSchema.index({
    companyId: 1,
    category: 1
});

// Text search on title
transactionSchema.index({
    title: "text"
});

export function getTransactionModel(connection) {
    return (
        connection.models.Transaction ||
        connection.model("Transaction", transactionSchema)
    );
}