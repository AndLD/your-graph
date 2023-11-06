import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { db } from '../../services/db'

const collectionName = 'connections'

async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const clusterId = req.params.clusterId
        if (!clusterId) {
            return res.sendStatus(500)
        }
        const connections = await db
            .collection(collectionName)
            .find({ clusterId })
            .toArray()
        res.json(connections)
    } catch (error) {
        next(error)
    }
}

async function post(req: Request, res: Response, next: NextFunction) {
    const { from, to, clusterId } = req.body
    if (!from || !to || !clusterId) {
        return next(new Error('Missing parameters'))
    }

    try {
        const newConnection = { from, to, clusterId }
        const result = await db
            .collection(collectionName)
            .insertOne(newConnection)
        res.json({ _id: result.insertedId, ...newConnection })
    } catch (error) {
        next(error)
    }
}

async function put(req: Request, res: Response, next: NextFunction) {
    const { from, to } = req.body
    const id = req.params.id
    if (!id || !from || !to) {
        return next(new Error('Missing parameters'))
    }

    try {
        const newValues = { $set: { from, to } }
        const result = await db
            .collection(collectionName)
            .updateOne({ _id: new ObjectId(id) }, newValues)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

async function deleteOne(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    if (!id) {
        return next(new Error('Missing parameters'))
    }

    try {
        const result = await db
            .collection(collectionName)
            .deleteOne({ _id: new ObjectId(id) })
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export const connectionsControllers = {
    get,
    post,
    put,
    deleteOne,
}
