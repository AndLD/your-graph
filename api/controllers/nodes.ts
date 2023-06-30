import { NextFunction, Request, Response } from 'express'
import { db } from '../services/db'
import { ErrorHandler } from '../middlewares/ErrorHandler'
import fs from 'fs'

async function get(req: Request, res: Response) {
    res.end()
}

async function post(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await db.collection('nodes').insertOne(req.body)

        if (result.insertedCount > 0) {
            return res.json(req.body)
        } else {
            const file = req.file
            if (file) {
                // If MongoDB insert fails, delete the file.
                fs.unlink(file.path, (unlinkError) => {
                    if (unlinkError) {
                        console.error(`Unable to delete file: ${file.path}`)
                    }
                })
            }

            throw new ErrorHandler(500, 'Failed to insert data into MongoDB.')
        }
    } catch (err) {
        next(err)
    }
}

async function put(req: Request, res: Response) {
    res.end()
}

async function deleteOne(req: Request, res: Response) {
    res.end()
}

export const nodesController = {
    get,
    post,
    put,
    deleteOne
}
