import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { db } from '../../services/db'

const collectionName = 'categories'

async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const clusterId = req.params.clusterId
        if (!clusterId) {
            return res.sendStatus(500)
        }
        const categories = await db
            .collection(collectionName)
            .find({
                $or: [{ clusterId }, { clusterId: null }],
            })
            .toArray()
        res.json(categories)
    } catch (err) {
        next(err)
    }
}

async function post(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await db.collection(collectionName).insertOne(req.body)

        res.json({ id: result.insertedId, ...req.body })
    } catch (err) {
        next(err)
    }
}

async function put(req: Request, res: Response, next: NextFunction) {
    // const { from, to } = req.body
    // const id = req.params.id
    // if (!id || !from || !to) {
    //     return next(new Error('Missing parameters'))
    // }
    // try {
    //     const newValues = { $set: { from, to } }
    //     const result = await db
    //         .collection(collectionName)
    //         .updateOne({ _id: new ObjectId(id) }, newValues)
    //     res.json(result)
    // } catch (error) {
    //     next(error)
    // }
}

async function deleteOne(req: Request, res: Response, next: NextFunction) {
    // const id = req.params.id
    // if (!id) {
    //     return next(new Error('Missing parameters'))
    // }
    // try {
    //     const result = await db
    //         .collection(collectionName)
    //         .deleteOne({ _id: new ObjectId(id) })
    //     res.json(result)
    // } catch (error) {
    //     next(error)
    // }
}

export const categoriesControllers = {
    get,
    post,
    put,
    deleteOne,
}
