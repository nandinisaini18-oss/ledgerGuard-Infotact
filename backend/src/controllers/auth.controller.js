import mongoose from "mongoose"
import userModel from "../models/user.model.js"
import companyModel from "../models/company.model.js"

export async function registerUser(req , res){
    const {fullname , email , password , role , companyId} = req.body

    try{
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(409).json({
                message : "user with this email already exists",
                success : false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID"
            });
        }

        const companyExists = await companyModel.findById(companyId)

        if(!companyExists){
            return res.status(404).json({
                message : "company doesn't exists",
                success : false
            })
        }

        const user = await userModel.create({
            fullname,
            email,
            password,
            role,
            companyId
        })

        return res.status(201).json({
            message : "user registered successfully",
            success : true,
            user : {
                fullname : user.fullname,
                email : user.email,
                role : user.role,
                companyId : user.companyId
            }
        })
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}