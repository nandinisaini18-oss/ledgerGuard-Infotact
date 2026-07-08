import companyModel from "../models/company.model.js"

export async function registerCompany(req , res){
    const {companyName , companyEmail , subscriptionPlan , status} = req.body

    try{
        const isCompanyExists = await companyModel.findOne({companyEmail})

        if(isCompanyExists){
            return res.status(409).json({
                message : "company already exists",
                success : false
            })
        }

        const company = await companyModel.create({
            companyName , 
            companyEmail , 
            subscriptionPlan , 
            status
        })

        return res.status(201).json({
            message : "company registered successfully",
            success : true,
            company : {
                companyId : company._id,
                companyName : company.companyName, 
                companyEmail : company.companyEmail, 
                subscriptionPlan : company.subscriptionPlan, 
                status : company.status
            }
        })
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}