import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import {config} from "../config/config.js"

function createToken(res , user , message , statusCode){
    const token = jwt.sign({
        id: user._id,
        companyId: user.companyId,
        jti: uuid()
        },config.JWT_SECRET,
        {expiresIn : config.EXPIRES_IN}
    )

    res.cookie("token" , token , {
        httpOnly : true,
        sameSite : "lax",
        secure : process.env.NODE_ENV === "production"
    })

    res.status(statusCode).json({
        success : true,
        message ,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        }
    })
}

export default createToken