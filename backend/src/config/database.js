import mongoose from "mongoose"
import { config } from "./config.js"

async function connectToDB(){
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to Database")
    }catch(err){
        console.error("Database connection failed:", err.message)
        process.exit(1)
    }
}

export default connectToDB