// allows us to connecto to the database
import {MongoClient, ServerApiVersion} from "mongodb"

const URI = process.env.ATLAS_URI || ""
const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    },
})

try{
    // connect the client to the server
    await client.connect()

    // send ping to confirm the connection
    await client.db("admin").command({ping: 1})
    console.log("Pinged your deployment. You Successfully connected to MongoDb!")
} catch(err){
    console.log("Failed to connect to Mongodb",err)
    // exit process if connection fails
    process.exit(1)
}

// handle shutdown( allows mongodb to close when server shuts down)
process.on('SIGNINT', async () => {
    console.log("Closing mongodb connection")
    await client.close()
    process.exit(0)
})

// will create User database if not already created
let db = client.db("Readinglog")

export default db
