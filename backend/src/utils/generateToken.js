import jwt from "jsonwebtoken"
import {config} from "../config/config.js"

function createToken(res , user , message , statusCode){
    const token = jwt.sign({
        id : user._id
        },config.JWT_SECRET,
        {expiresIn : config.EXPIRES_IN}
    )

    res.cookie("token" , token , {
        httpOnly : true,
        sameSite : "lax",
        secure : false
    })

    res.status(statusCode).json({
        message ,
        success : true,
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