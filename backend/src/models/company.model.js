import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true,
        unique : true
    },
    companyEmail : {
        type : String,
        required : true,
        unique : true
    },
    databaseName: {
        type: String,
        required: true,
        unique: true
    },
    subscriptionPlan : {
        type : String,
        enum: ["basic", "pro", "enterprise"],
        default: "basic"
    },
    status : {
        type : String,
        enum: ["active", "inactive"],
        default: "active"
    },
}, 
    {
        timestamps : true
})

const companyModel = mongoose.model("Company" , companySchema)

export default companyModel