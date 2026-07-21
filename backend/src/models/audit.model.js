import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true
        },

        action: {
            type: String,
            enum: ["CREATE", "UPDATE", "DELETE"],
            required: true
        },

        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export function getAuditModel(connection) {
    return (
        connection.models.Audit ||
        connection.model("Audit", auditSchema)
    );
}