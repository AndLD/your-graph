import { NextFunction, Request, Response } from 'express'
import { db } from '../../services/db'
import { ObjectId } from 'mongodb'

async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const clusterId = req.params.clusterId
        if (!clusterId) {
            return res.sendStatus(500)
        }
        const sources = await db
            .collection('sources')
            .find({ clusterId })
            .toArray()
        res.json(sources)
    } catch (err) {
        next(err)
    }
}

async function post(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await db.collection('sources').insertOne(req.body)

        res.json({ id: result.insertedId, ...req.body })
    } catch (err) {
        next(err)
    }
}

async function put(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        if (!req.body.title && !req.body.link) {
            return next(new Error('Missing parameters'))
        }

        // TODO: Add check if no one modified
        const result = await db
            .collection('sources')
            .updateOne({ _id: new ObjectId(id) }, { $set: req.body })
        res.json({ id, ...req.body })
    } catch (err) {
        next(err)
    }
}

async function deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const result = await db
            .collection('sources')
            .deleteOne({ _id: new ObjectId(id) })
        res.json(result)
    } catch (err) {
        next(err)
    }
}

export const sourcesControllers = {
    get,
    post,
    put,
    deleteOne,
}
