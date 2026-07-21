import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables")
}

if(!process.env.EXPIRES_IN){
    throw new Error("EXPIRES_IN is not defined in environment variables")
}

if(!process.env.CLIENT_URL){
    throw new Error("CLIENT_URL is not defined in environment variables")
}

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
}

export const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    EXPIRES_IN : process.env.EXPIRES_IN,
    CLIENT_URL : process.env.CLIENT_URL,
    REDIS_URL : process.env.REDIS_URL
}