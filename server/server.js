import express from "express"
import cors from "cors"
import books from "./routes/books.js"

// allows use to check that the server is running and that we connected sucessfully to the database
const PORT = process.env.PORT ||5050
const app = express()

app.use(cors())

// increase request limit to handle base64 img (10mb)
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({limit: '10mb', extended: true}))
app.use("/api/books", books) 

//  check endpoint
app.get("/", (req, res) => {
    res.json({message: "Reading Log API is running!"})
})

// start the express server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})