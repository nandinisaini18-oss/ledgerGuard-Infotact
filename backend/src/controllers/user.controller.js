import mongoose from "mongoose";
import companyModel from "../models/company.model.js";
import { getTenantConnection } from "../database/tenantConnection.js";
import { getUserModel } from "../models/tenantUser.model.js";

/**
 * Get All Users (of the authenticated company)
 */
export async function getUsers(req, res) {
    try {
        const company = await companyModel.findById(req.user.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const connection = getTenantConnection(company.databaseName);

        const User = getUserModel(connection);

        // Read page, limit and search from query parameters
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const { search } = req.query;

        const filter = {
            companyId: req.user.companyId
        };

        if (search) {
            filter.$or = [
                { fullname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // Calculate how many documents to skip
        const skip = (page - 1) * limit;

        // Count total users for this company
        const totalUsers = await User.countDocuments(filter);

        // Fetch paginated users
        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate total pages
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalUsers,
            totalPages,
            count: users.length,
            users: users.map((user) => ({
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }))
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

/**
 * Get Single User (of the authenticated company)
 */
export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
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

        const User = getUserModel(connection);

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (String(user.companyId) !== String(req.user.companyId)) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

/**
 * Create User (in the authenticated company)
 */
export async function createUser(req, res) {
    const { fullname, email, password, role } = req.body;

    try {
        const company = await companyModel.findById(req.user.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const connection = getTenantConnection(company.databaseName);

        const User = getUserModel(connection);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "user with this email already exists"
            });
        }

        const user = await User.create({
            fullname,
            email,
            password,
            role: role || "user",
            companyId: req.user.companyId
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

/**
 * Update User (name and email only)
 */
export async function updateUser(req, res) {
    const { id } = req.params;
    const { fullname, email } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
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

        const User = getUserModel(connection);

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (String(user.companyId) !== String(req.user.companyId)) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (email !== undefined) {
            const emailExists = await User.findOne({
                email,
                _id: { $ne: id }
            });

            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "user with this email already exists"
                });
            }
        }

        user.fullname = fullname ?? user.fullname;
        user.email = email ?? user.email;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

/**
 * Update User Role (admin <-> user)
 */
export async function updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
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

        const User = getUserModel(connection);

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (String(user.companyId) !== String(req.user.companyId)) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
