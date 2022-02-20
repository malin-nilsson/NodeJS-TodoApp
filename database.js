const { MongoClient } = require('mongodb')
require('dotenv').config();

// Get database
async function getDb() {
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING)
    await client.connect()

    const db = client.db("todo-app")

    return db
}

// Get todos collection
async function getTodosCollection() {
    const db = await getDb()
    return db.collection("todos")
}

module.exports = {
    getDb,
    getTodosCollection
}