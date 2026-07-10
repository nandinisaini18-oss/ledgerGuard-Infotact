import companyModel from "../models/company.model.js"

export async function registerCompany(req , res){
    const {companyName , companyEmail , subscriptionPlan } = req.body

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
            subscriptionPlan 
        })

        return res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company: {
                id: company._id,
                companyName: company.companyName,
                companyEmail: company.companyEmail,
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
