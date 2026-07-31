import crypto from "crypto"
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

export async function getCompanyProfile(req , res){
    try{
        const company = await companyModel.findById(req.user.companyId);

        if(!company){
            return res.status(404).json({
                success : false,
                message : "Company not found"
            })
        }

        return res.status(200).json({
            message : "Company profile fetched successfully",
            success : true,
            company: {
                companyId: company._id,
                companyName: company.companyName,
                companyEmail: company.companyEmail,
                subscription: company.subscriptionPlan,
                status: company.status,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
            }
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export async function updateCompanyProfile(req , res){
    const { companyName , companyEmail } = req.body;

    try{
        const company = await companyModel.findById(req.user.companyId);

        if(!company){
            return res.status(404).json({
                success : false,
                message : "Company not found"
            })
        }

        if(companyName !== undefined){
            const nameExists = await companyModel.findOne({
                companyName,
                _id: { $ne: req.user.companyId }
            });

            if(nameExists){
                return res.status(409).json({
                    success : false,
                    message : "Company name already exists"
                })
            }
        }

        if(companyEmail !== undefined){
            const emailExists = await companyModel.findOne({
                companyEmail,
                _id: { $ne: req.user.companyId }
            });

            if(emailExists){
                return res.status(409).json({
                    success : false,
                    message : "Company email already exists"
                })
            }
        }

        company.companyName = companyName ?? company.companyName;
        company.companyEmail = companyEmail ?? company.companyEmail;

        await company.save();

        return res.status(200).json({
            message : "Company profile updated successfully",
            success : true,
            company: {
                companyId: company._id,
                companyName: company.companyName,
                companyEmail: company.companyEmail,
                subscription: company.subscriptionPlan,
                status: company.status,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
            }
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

