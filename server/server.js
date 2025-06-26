import express from "express"
import cors from "cors"
import records from "./routes/records.js"

// allows use to check that the server is running and that we connected sucessfully to the database
const PORT = process.env.PORT ||5050
const app = express()

app.use(cors())
app.use(express.json())
app.use("/record", records) // anything in the path /record will be records

// start the express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})