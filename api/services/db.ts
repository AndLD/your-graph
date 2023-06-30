import { MongoClient } from 'mongodb'

export let mongoClient: any
export let db: any

async function init() {
    mongoClient = new MongoClient(process.env.MONGO_DB_URI || 'mongodb://localhost:27017')
    await mongoClient.connect()
    db = mongoClient.db('your-graph')
}

export const dbService = {
    init
}
