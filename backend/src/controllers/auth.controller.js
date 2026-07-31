import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import companyModel from "../models/company.model.js"
import createToken from "../utils/generateToken.js"
import redis from "../config/redis.js"
import { getTenantConnection } from "../database/tenantConnection.js"
import { getUserModel } from "../models/tenantUser.model.js";

export async function registerUser(req , res){
    const {fullname , email , password , role , companyId} = req.body

    try{
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID"
            });
        }

        const companyExists = await companyModel.findById(companyId);

        if (!companyExists) {
            return res.status(400).json({
                success:false,
                message:"Registration failed"
            });
        }

        const connection = getTenantConnection(companyExists.databaseName);

        const User = getUserModel(connection);

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(409).json({
                message : "user with this email already exists",
                success : false
            })
        }

        const user = await User.create({
            fullname,
            email,
            password,
            role,
            companyId
        })

        return await createToken(res , user , "user registered successfully" , 201)

    }catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function loginUser(req , res){

    try{
        const { companyName, email, password } = req.body;

        const company = await companyModel.findOne({
            companyName: companyName.trim()
        });

        if (!company) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const connection = getTenantConnection(company.databaseName);

        const User = getUserModel(connection);

        const user = await User.findOne({ email }).select("+password");

        if(!user){
            return res.status(401).json({
                success : false,
                message : "Invalid email or password"
            })
        }

        const isPasswordMatched = await user.comparePassword(password)

        if(!isPasswordMatched){
            return res.status(401).json({
                success : false,
                message : "Invalid email or password"
            })
        }

        return createToken(res , user , "user loggedIn successfully" , 200)
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export async function getUser(req , res){
    try{
        const user = req.user;

        if(!user){
            return res.status(404).json({
                success : false,
                message : "user not found"
            })
        }

        return res.status(200).json({
            message : "user details fetched successfully",
            success : true,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export async function logOutUser(req , res){
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.decode(token);
            if (decoded && decoded.jti) {
                const ttl = decoded.exp
                    ? Math.max(decoded.exp - Math.floor(Date.now() / 1000), 60)
                    : 3600;
                await redis.set(`bl:${decoded.jti}`, "1", "EX", ttl);
            }
        }
    } catch {
        // Token invalid or Redis unavailable — clear cookie anyway
    }

    res.clearCookie("token" , {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    })

    res.status(200).json({
        success : true,
        message : "user loggedout successfully"
    })
}