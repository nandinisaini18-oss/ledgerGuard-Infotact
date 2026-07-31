import crypto from "crypto"
import mongoose from "mongoose"
import companyModel from "../models/company.model.js"

export async function registerCompany(req , res){
    const {companyName , companyEmail , subscriptionPlan } = req.body
    const databaseName = `company_${companyName.toLowerCase().replace(/\s+/g, "_")}_${crypto.randomBytes(3).toString("hex")}`;

    try{
         const isCompanyExists = await companyModel.findOne({
            $or: [
                { companyEmail },
                { companyName }
            ]
        })

        if(isCompanyExists){
            return res.status(409).json({
                success : false,
                message : "company already exists"
            })
        }

        const company = await companyModel.create({
            companyName , 
            companyEmail , 
            subscriptionPlan ,
            databaseName
        })

        return res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company: {
                id: company._id,
                companyName: company.companyName,
                companyEmail: company.companyEmail,
                databaseName: company.databaseName,
                subscriptionPlan: company.subscriptionPlan,
                status: company.status
            }
        });

    }catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

/**
 * Get All Companies (Admin Only)
 */
export async function getCompanies(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalCompanies = await companyModel.countDocuments();

        const companies = await companyModel
            .find()
            .select("_id companyName companyEmail subscriptionPlan status createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalCompanies / limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalCompanies,
            totalPages,
            count: companies.length,
            companies: companies.map((company) => ({
                companyId: company._id,
                companyName: company.companyName,
                email: company.companyEmail,
                subscription: company.subscriptionPlan,
                status: company.status,
                createdAt: company.createdAt
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
 * Get Single Company (Admin Only)
 */
export async function getCompany(req, res) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company id"
            });
        }

        const company = await companyModel
            .findById(id)
            .select("_id companyName companyEmail subscriptionPlan status createdAt updatedAt");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            company: {
                companyId: company._id,
                companyName: company.companyName,
                email: company.companyEmail,
                subscription: company.subscriptionPlan,
                status: company.status,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
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
 * Update Company (Admin Only)
 */
export async function updateCompany(req, res) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company id"
            });
        }

        const company = await companyModel.findById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        company.companyName = req.body.companyName ?? company.companyName;
        company.companyEmail = req.body.companyEmail ?? company.companyEmail;
        company.subscriptionPlan = req.body.subscriptionPlan ?? company.subscriptionPlan;
        company.status = req.body.status ?? company.status;

        await company.save();

        return res.status(200).json({
            success: true,
            message: "Company updated successfully",
            company: {
                companyId: company._id,
                companyName: company.companyName,
                email: company.companyEmail,
                subscription: company.subscriptionPlan,
                status: company.status,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
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
 * Toggle Company Status (Admin Only)
 */
export async function toggleCompanyStatus(req, res) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company id"
            });
        }

        const company = await companyModel.findById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        company.status = company.status === "active" ? "inactive" : "active";

        await company.save();

        return res.status(200).json({
            success: true,
            message: `Company ${company.status === "active" ? "enabled" : "disabled"} successfully`,
            company: {
                companyId: company._id,
                companyName: company.companyName,
                email: company.companyEmail,
                subscription: company.subscriptionPlan,
                status: company.status,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
