import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import companyRouter from "./routes/company.routes.js"
import { config } from "./config/config.js"

const app = express()

app.use(cors({
    origin : config.CLIENT_URL,
    credentials : true
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth/user" , authRouter)
app.use("/api/auth/company" , companyRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LedgerGuard API Running",
    })
})

export default app