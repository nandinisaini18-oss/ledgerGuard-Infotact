import mongoose from "mongoose";
import bcrypt from "bcrypt";

const tenantUserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        }
    },
    {
        timestamps: true
    }
);

tenantUserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

tenantUserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export function getUserModel(connection) {
    return (
        connection.models.User ||
        connection.model("User", tenantUserSchema)
    );
}