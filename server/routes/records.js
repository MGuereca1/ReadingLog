import express from "express"

// connect to db; may need to modify route
import db from "../db/connection.js"; 

// this helps convert the id from string to the ObjectId for the _id
import { ObjectId } from "mongodb";

// router is an instance of the express router it is used to define our routes
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router()


// helper function to calculate the progress percentage of the book
const calculateProgress  = (pageStart, pageEnd, totalPages) => {
    if(!totalPages || totalPages <= 0) return 0
    const pagesRead = Math.max(0, pageEnd - pageStart + 1)
    return Math.min(100, Math.round((pagesRead / totalPages) * 100))
}


// get a list of all the records
router.get("/", async (req, res) => {
    try{
        let collection = await db.collection("records") // will appear in the collection of the cluster
        let results = await collection.find({}).toArray()
        res.status(200).send(results)
    } catch (err) {
        console.error(err)
        res.status(500).send("Error fetching records")
    }
})

// get a single record by id
router.get("/:id", async (req, res) => {
    try{
        let collection = await db.collection("records")
        let query = { _id: new ObjectId(req.params.id)}
        let result = await collection.findOne(query)

        if (!result) {
            res.status(404).send("Not found")
        }
        else{
            res.status(200).send(result)
        }
 } catch(err){
    console.error(err)
    res.status(500).send("Error fetching records")
 }
})

// create a new record
router.post("/", async (req, res) => {
    try {
        //validate required fields
        const { Bookname, totalPages, date, pageStart, pageEnd } = req.body

        if(!Bookname || !totalPages || !date || !pageStart === undefined || pageEnd === undefined){
            return res.status(400).send("Missing required fields: Bookname, totalPages, date, pageStart, pageEnd")
        }

        //validate page numbers
        if(pageStart < 1 || pageEnd < pageStart || pageEnd > totalPages){
            return res.status(400).send("Invalid page numbers")
        }

        // calculate progress percentage
        const progress = calculateProgress(pageStart, pageEnd, totalPages)

        let newDoc = {
            Bookname: Bookname,
            totalPages: totalPages,
            date: new Date(date),
            pageStart: parseInt(pageStart), // parseInt is used because all data that comes from HTTP requests are initially string so 25 would be read as "25"
            pageEnd: parseInt(pageEnd),
            progress: progress,
            createdAt: new Date(),
            updatedAt: new Date()

        }

        let collection = await db.collection("records")
        let result = await collection.insertOne(newDoc)

        //return created doc with its ID
        const createdDoc =  await collection.findOne({ _id: result.insertedId})
        res.status(204).send(createdDoc)

    } catch (err) {
        console.error(err)
        res.status(500).send("Error adding record")
    }
})

// to update record by id (may use for editing)?
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)}

        //build update obkect with the fields
        const updateFields = {}
        const { Bookname, totalPages, date, pageStart, pageEnd } = req.body

        if (Bookname !== undefined) updateFields.Bookname = Bookname
        if (totalPages !== undefined) updateFields.totalPages = parseInt(totalPages)
        if (date !== undefined) updateFields.date = new Date(date)
        if (pageStart !== undefined) updateFields.pageStart = parseInt(pageStart)
        if (pageEnd !== undefined) updateFields.pageEnd = parseInt(pageEnd)

        //  recalculate the progress if somehting is updated
        if (pageStart !== undefined || pageEnd !== undefined || totalPages !== undefined){
            //get current document to fill in missing values for calculation
            const currentDoc = await db.collection("records").findOne(query)
            if(!currentDoc){
                return res.status(404).send("Record not found")
            }

            const finalPageStart = pageStart !== undefined ? parseInt(pageStart) : currentDoc.pageStart
            const finalPageEnd = pageEnd !== undefined ? parseInt(pageEnd) : currentDoc.pageEnd
            const finalTotalPages = totalPages !== undefined ? parseInt(totalPages) : currentDoc.totalPages

            // validate page numbers
            if (finalPageEnd < 1 || finalPageEnd < finalPageStart || finalPageEnd > finalTotalPages ){
                return res.status(400).send("Invalid page numbers")
            }
            updateFields.progress = calculateProgress(finalPageStart, finalPageEnd, finalTotalPages)
        }

        updateFields.updatedAt = new Date()

        const updates = { $set: updateFields }
        
        let collection = await db.collection("records")
        let result = await collection.updateOne(query, updates)

        if(result.matchedCount === 0){
            res.status(400).send("Record not found")    
        } else{
            // return the updated doc
            const updatedDoc = await collection.findOne(query)
            res.status(200).send(updatedDoc) 
        }
    } catch (err) {
        console.error(err)
        res.status(500).send("Error adding record")
    }
})


//  to delete a record
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id)}

        const collection = db.collection("records")
        let result = await collection.deleteOne(query)

        if (result.deletedCount === 0) {
            res.status(404).send("Record not found")
        } else {
            res.status(200).send({message: "Record deleted successfully", deletedCount: result.deletedCount})
        }
    } catch (err) {
        console.error(err)
        res.status(500).send("Error adding record")
    }
})

export default router