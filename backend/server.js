import app from "./src/app.js"
import connectToDB from "./src/config/database.js"

const PORT = process.env.PORT || 3000

async function startServer() {
    await connectToDB()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer()