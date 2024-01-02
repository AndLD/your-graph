import { NextFunction, Response } from 'express'
import { db } from '../../services/db'
import { AuthorizedRequest } from '../../utils/types'
import { ObjectId } from 'mongodb'
import { IClusterPostBody, IClusterPut } from '../../utils/interfaces/cluster'
import { ErrorHandler } from '../../middlewares/ErrorHandler'

const collectionName = 'clusters'

async function getByUserId(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.sendStatus(500)
        }

        const items = await db
            .collection(collectionName)
            .find({ userId })
            .toArray()
        res.json(items)
    } catch (error) {
        next(error)
    }
}

async function getOneById(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.id

        const cluster =
            req.middlewarePayload?.item ||
            (await db
                .collection(collectionName)
                .findOne({ _id: new ObjectId(id) }))

        if (!cluster) {
            return res.sendStatus(404)
        }

        const result: any = {}

        console.time('getOneById')
        ;['nodes', 'connections', 'sources'].forEach((component) => {
            result[component] = db
                .collection(component)
                .find({ clusterId: cluster._id.toString() })
                .toArray()
        })

        const promiseResults = await Promise.all(Object.values(result))
        console.timeEnd('getOneById')

        const keys = Object.keys(result)

        for (let i = 0; i < keys.length; i++) {
            result[keys[i]] = promiseResults[i]
        }

        res.json(result)
    } catch (error) {
        next(error)
    }
}

// TODO Andrii Larionov: Need to test this method and compare performance with getOneById on high load. Probably it would be a good practice to switch getOneById to this method on high load.
async function getOneById_using_aggregation(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const clusterId = req.params.id

        const cluster =
            req.middlewarePayload?.item ||
            (await db
                .collection(collectionName)
                .findOne({ _id: new ObjectId(clusterId) }))

        if (!cluster) {
            return res.sendStatus(404)
        }

        const resultCursor = db.collection('clusters').aggregate([
            {
                $lookup: {
                    from: 'nodes',
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$clusterId', clusterId] }
                            }
                        }
                    ],
                    as: 'nodes'
                }
            },
            {
                $lookup: {
                    from: 'connections',
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$clusterId', clusterId] }
                            }
                        }
                    ],
                    as: 'connections'
                }
            },
            {
                $lookup: {
                    from: 'sources',
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$clusterId', clusterId] }
                            }
                        }
                    ],
                    as: 'sources'
                }
            },
            {
                $project: {
                    nodes: '$nodes',
                    connections: '$connections',
                    sources: '$sources',
                    _id: 0
                }
            }
        ])

        const result = (await resultCursor.toArray())[0]

        res.json(result)
    } catch (error) {
        next(error)
    }
}

async function post(req: AuthorizedRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.sendStatus(500)
        }

        const newCluster: IClusterPostBody = {
            title: req.body.title,
            access: req.body.access || 'private',
            userId
        }

        if (req.body.description) {
            newCluster.description = req.body.description
        }

        const result = await db.collection(collectionName).insertOne(newCluster)
        res.json({ _id: result.insertedId, ...newCluster })
    } catch (error) {
        next(error)
    }
}

async function put(req: AuthorizedRequest, res: Response, next: NextFunction) {
    try {
        const id = req.params.id
        const userId = req.user?._id
        if (!userId) {
            return res.sendStatus(500)
        }

        // TODO: Go through all body fields and add them to the updates object after validation
        const updates: IClusterPut = {
            updatedAt: Date.now()
        }
        if (req.body.title) {
            updates.title = req.body.title
        }
        if (req.body.access) {
            updates.access = req.body.access
        }
        if (req.body.deleted !== undefined) {
            updates.deleted = req.body.deleted
        }

        // Update the cluster in the database
        const updateResult = await db
            .collection(collectionName)
            .updateOne({ _id: new ObjectId(id), userId }, { $set: updates })

        if (updateResult.matchedCount === 0) {
            throw new ErrorHandler(
                404,
                `Cluster with id: ${id} and userId: ${userId} not found`
            )
        } else if (updateResult.modifiedCount === 0 && !req.file) {
            throw new ErrorHandler(
                400,
                `Cluster with id: ${id} and userId: ${userId} was not modified`
            )
        }

        const updated = await db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(id) })

        res.json(updated)
    } catch (error) {
        next(error)
    }
}

async function deleteOne(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.user?._id
        const id = req.params.id
        if (!userId) {
            return res.sendStatus(500)
        }

        // Update the cluster in the database
        const updateResult = await db
            .collection(collectionName)
            .updateOne(
                { _id: new ObjectId(id), userId },
                { $set: { deleted: true, updatedAt: Date.now() } }
            )

        if (updateResult.matchedCount === 0) {
            throw new ErrorHandler(
                404,
                `Cluster with id: ${id} and userId: ${userId} not found`
            )
        } else if (updateResult.modifiedCount === 0 && !req.file) {
            throw new ErrorHandler(
                400,
                `Cluster with id: ${id} and userId: ${userId} was not modified`
            )
        }

        const result = await db
            .collection(collectionName)
            .deleteOne({ _id: new ObjectId(id), userId })

        if (!result.deletedCount) {
            return res.sendStatus(404)
        }
        res.json({ _id: id })
    } catch (error) {
        next(error)
    }
}

export const clustersControllers = {
    getByUserId,
    getOneById,
    getOneById_using_aggregation,
    post,
    put,
    deleteOne
}
