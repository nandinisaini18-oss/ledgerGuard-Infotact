import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import userModel from "../models/user.model.js"

export async function authenticateUser(req , res , next){
    const token = req.cookies.token

    try{
        if(!token){
            return res.status(401).json({
                message : "Unauthorised access",
                success : false
            })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const company = await companyModel.findById(decoded.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const connection = getTenantConnection(company.databaseName);

        const User = getUserModel(connection);


        const user = await userModel.findById(decoded.id).select("-password");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        req.user = user

        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

