import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LedgerGuard API Running",
    })
})

export default app