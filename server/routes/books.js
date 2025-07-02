import express from "express"

// connect to db; may need to modify route
import db from "../db/connection.js"; 

// this helps convert the id from string to the ObjectId for the _id
import { ObjectId } from "mongodb";

// router is an instance of the express router it is used to define our routes
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router()


// helper function to calculate the progress percentage of the book
const calculateProgress  = (sessions, totalPages) => {
    if(!totalPages || sessions.length === 0) return 0
    const MaxPageRead = Math.max(...sessions.map(session => session.endPage))
    return Math.min(Math.round((MaxPageRead / totalPages) * 100), 100)
}

// helper function to determine book status
const getBookStatus = (progress) => {
    if(progress == 0) return 'to read'
    if (progress == 100) return ' completed'
    return 'reading'
}

// get all the books
router.get("/", async (req, res) => {
    try{
        let collection = await db.collection("books") // will appear in the collection of the cluster
        let results = await collection.find({}).toArray()
        res.status(200).send(results)
    } catch (err) {
        console.error(err)
        res.status(500).send("Error fetching books")
    }
})

// get a single book by id
router.get("/:id", async (req, res) => {
    try{
        let collection = await db.collection("books")
        let query = { _id: new ObjectId(req.params.id)}
        let result = await collection.findOne(query)

        if (!result) {
            res.status(404).send("Book not found")
        }
        else{
            res.status(200).send(result)
        }
 } catch(err){
    console.error(err)
    res.status(500).send("Error fetching book")
 }
})

// create a new book
router.post("/", async (req, res) => {
    try {
        //validate required fields
        const { title, author, totalPages, notes} = req.body

        if(!title || !author ){
            return res.status(400).send("Missing required fields: title and author")
        }

        let newBook = {
            title: title,
            author: author,
            totalPages: parseInt(totalPages) || 0, // parseInt is used because all data that comes from HTTP requests are initially string so 25 would be read as "25"
            currentPage: 0,
            progress: 0,
            status: 'to-read',
            rating: 0,
            notes: notes || '',
            readingSessions: [],
            startDate: null,
            endDate: null,
            cover: null,
            createdAt: new Date(),
            updatedAt: new Date()

        }

        let collection = await db.collection("books")
        let result = await collection.insertOne(newBook)

        //return created doc with its ID
        const createdBook =  await collection.findOne({ _id: result.insertedId})
        res.status(201).send(createdBook)

    } catch (err) {
        console.error(err)
        res.status(500).send("Error adding book")
    }
})

// to update book (for reading sessions)
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)}

        //get current book
        const currentBook = await db.collection("books").findOne(query)
        if (!currentBook){
            return res.status(404).send("Book not found")
        }

        const updateFields = {}
        const { title, author, totalPages, notes, rating, readingSessions } = req.body

        // update the basic fields
        if ( title !== undefined) updateFields.title = title
        if ( author !== undefined) updateFields.author = author
        if ( totalPages !== undefined) updateFields.totalPages = parseInt(totalPages)
        if ( notes !== undefined) updateFields.notes = notes
        if ( rating !== undefined) updateFields.rating = parseInt(rating)
        

        // handle reading sessions update
        if (readingSessions !== undefined){
            updateFields.readingSessions = readingSessions

            // recalculate progress and status
            const progress = calculateProgress(readingSessions, updateFields.totalPages || currentBook.totalPages)
            updateFields.progress = progress
            updateFields.status = getBookStatus(progress)

            // update current page
            if (readingSessions.length > 0){
                updateFields.currentPage = Math.max(...readingSessions.map(session => session.endPage))
            } else{
                updateFields.currentPage = 0
            }

            // set start date if first session and not already set
            if (readingSessions.length > 0 && !currentBook.startDate){
                updateFields.startDate = readingSessions[0].date
            }

            // set endDate if completed
            if (progress === 100){
                const latestSession = readingSessions.sort((a, b) => new Date(b.date)-new Date(a.date))[0]
                updateFields.endDate = latestSession.date
            } else{
                updateFields.endDate = null
            }
        }

        updateFields.updatedAt = new Date()
        
        let collection = await db.collection("books")
        let result = await collection.updateOne(query, {$set: updateFields})

        if(result.matchedCount === 0){
            res.status(400).send("Book not found")    
        } else{
            // return the updated doc
            const updatedBook = await collection.findOne(query)
            res.status(200).send(updatedBook) 
        }
    } catch (err) {
        console.error(err)
        res.status(500).send("Error updating book")
    }
})


//  to delete a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)}

        const collection = db.collection("books")
        let result = await collection.deleteOne(query)

        if (result.deletedCount === 0) {
            res.status(404).send("Book not found")
        } else {
            res.status(200).send({message: "Book deleted successfully", deletedCount: result.deletedCount})
        }
    } catch (err) {
        console.error(err)
        res.status(500).send("Error deleting book")
    }
})

export default router