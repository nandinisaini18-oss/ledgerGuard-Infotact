import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import companyRouter from "./routes/company.routes.js"
import transactionRouter from "./routes/transaction.routes.js"
import analyticsRouter from "./routes/analytics.routes.js";
import companyProfileRouter from "./routes/companyProfile.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.midlleware.js"
import { config } from "./config/config.js"

const app = express()

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "0");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});

app.use(cors({
    origin : config.CLIENT_URL,
    credentials : true
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth/user" , authRouter)
app.use("/api/auth/company" , companyRouter)
app.use("/api/transactions" , transactionRouter)
app.use("/api/analytics", analyticsRouter);
app.use("/api/company" , companyProfileRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LedgerGuard API Running",
    })
})

app.use(errorHandler);

export default app