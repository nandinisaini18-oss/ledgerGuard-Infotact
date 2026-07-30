import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import redis from "../config/redis.js"
import companyModel from "../models/company.model.js";
import { getTenantConnection } from "../database/tenantConnection.js";
import { getUserModel } from "../models/tenantUser.model.js";

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

        try {
            const blacklisted = await redis.get(`bl:${decoded.jti}`);
            if (blacklisted) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token"
                });
            }
        } catch {
            // Redis unavailable — proceed without blacklist check
        }

        const company = await companyModel.findById(decoded.companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const connection = getTenantConnection(company.databaseName);

        const User = getUserModel(connection);


        const user = await User.findById(decoded.id).select("-password");

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

