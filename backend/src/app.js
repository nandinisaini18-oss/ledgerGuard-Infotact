import express from "express"
import authRouter from "./routes/auth.routes.js"
import companyRouter from "./routes/company.routes.js"

const app = express()

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