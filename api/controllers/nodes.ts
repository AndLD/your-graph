import { NextFunction, Request, Response } from 'express'
import { db } from '../services/db'
import { ErrorHandler } from '../middlewares/ErrorHandler'
import fs from 'fs'
import { ObjectId } from 'mongodb'
import path from 'path'

async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const nodes = await db.collection('nodes').find().toArray()

        res.json(nodes)
    } catch (err) {
        next(new ErrorHandler(500, 'Failed to fetch data from MongoDB.'))
    }
}

async function post(req: Request, res: Response, next: NextFunction) {
    try {
        const selectedNodeId = req.query.selectedNodeId

        if (req.body.tags) {
            req.body.tags = JSON.parse(req.body.tags)
        }
        if (req.body.startDate === 'null') {
            req.body.startDate = null
        }
        if (req.body.endDate === 'null') {
            req.body.endDate = null
        }
        const data = req.body
        if (req.body._id) {
            data._id = new ObjectId(req.body._id)
        }

        let result = await db.collection('nodes').insertOne(data)

        if (result.insertedId) {
            const resBody: any = {
                node: {
                    ...req.body,
                    _id: result.insertedId
                }
            }

            if (selectedNodeId) {
                const connection = { from: selectedNodeId, to: result.insertedId.toString() }

                result = await db.collection('connections').insertOne(connection)

                if (result.insertedId) {
                    resBody.connection = {
                        ...connection,
                        _id: result.insertedId
                    }
                }
            }

            return res.json(resBody)
        } else {
            throw new ErrorHandler(500, 'Failed to insert data into MongoDB.')
        }
    } catch (err) {
        const file = req.file

        if (file) {
            // If MongoDB insert fails, delete the file.
            fs.unlink(file.path, (unlinkError) => {
                if (unlinkError) {
                    console.error(`Unable to delete file: ${file.path}`)
                }
            })
        }

        next(err)
    }
}

async function put(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params

        // Check if the provided id is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            throw new ErrorHandler(400, `Invalid id: ${id}`)
        }

        if (req.body.tags) {
            req.body.tags = JSON.parse(req.body.tags)
        }
        if (req.body.startDate === 'null') {
            req.body.startDate = null
        }
        if (req.body.endDate === 'null') {
            req.body.endDate = null
        }

        // Update the node in the database
        const updateResult = await db.collection('nodes').updateOne({ _id: new ObjectId(id) }, { $set: req.body })

        if (updateResult.matchedCount === 0) {
            throw new ErrorHandler(404, `Node with id: ${id} not found`)
        } else if (updateResult.modifiedCount === 0 && !req.file) {
            throw new ErrorHandler(400, `Node with id: ${id} was not modified`)
        } else {
            const updated = await db.collection('nodes').findOne({ _id: new ObjectId(id) })

            res.json(updated)
        }
    } catch (err) {
        next(err)
    }
}

async function putPositions(req: Request, res: Response, next: NextFunction) {
    try {
        const bulkWriteOptions = req.body.map(({ _id, ...rest }: { _id: string; x: number; y: number }) => ({
            updateOne: { filter: { _id: new ObjectId(_id) }, update: { $set: rest } }
        }))

        const result = await db.collection('nodes').bulkWrite(bulkWriteOptions)

        if (result.matchedCount === 0) {
            throw new ErrorHandler(404, 'No one node found')
        } else if (result.modifiedCount === 0) {
            throw new ErrorHandler(400, 'No one node modified')
        }

        res.end()
    } catch (err) {
        next(err)
    }
}

async function deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params

        // Fetch the node before deleting it
        const node = await db.collection('nodes').findOne({ _id: new ObjectId(id) })

        if (!node) {
            throw new ErrorHandler(404, `Node with id: ${id} not found`)
        }

        // Delete any connections associated with this node
        await db.collection('connections').deleteMany({ $or: [{ from: id }, { to: id }] })

        // Delete the node from database
        const deleteResult = await db.collection('nodes').deleteOne({ _id: new ObjectId(id) })

        if (deleteResult.deletedCount === 0) {
            throw new ErrorHandler(404, `Node with id: ${id} not found`)
        }

        // Delete the file
        fs.readdir(path.join(__dirname, '..', 'public', 'images'), (err, files) => {
            if (err) {
                console.error(`Failed to read directory: ${err}`)
            } else {
                const fileToDelete = files.find((file) => file.startsWith(node._id.toString()))
                if (fileToDelete) {
                    fs.unlink(path.join(__dirname, '..', 'public', 'images', fileToDelete), (err) => {
                        if (err) {
                            console.error(`Failed to delete file for Node with id: ${id}`)
                        }
                    })
                }
            }
        })

        res.json({ message: `Node with id: ${id} deleted successfully` })
    } catch (err) {
        next(err)
    }
}

export const nodesControllers = {
    get,
    post,
    put,
    putPositions,
    deleteOne
}
