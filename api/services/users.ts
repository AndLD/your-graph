import bcrypt from 'bcrypt'
import { Response } from 'express'
import { apiUtils } from '../utils/api'
import {
    entities,
    errors,
    rootUser as rootUserConfig,
} from '../utils/constants'
import {
    IUser,
    IUserPost,
    IUserPostBody,
    UserStatus,
} from '../utils/interfaces/user'
import { getKeywords } from '../utils/keywords'
import { getLogger } from '../utils/logger'
import { db } from './db'
import { Document, FindCursor, ObjectId, WithId } from 'mongodb'

const logger = getLogger('services/users')

const entity = entities.USERS

async function countUsersByState(res: Response) {
    const raws: {
        _id: ObjectId
        status?: UserStatus
    }[] = await db
        .collection(entity)
        .find({}, { projection: { status: 1 } })
        .toArray()

    const users = {
        admin: 0,
        owner: 0,
        user: 0,
        unlimited: 0,
        banned: 0,
    }

    for (const raw of raws) {
        users[raw.status as UserStatus]++
    }

    return users
}

async function getRootUser() {
    const rootUser: WithId<Document> | null = await db
        .collection(entities.USERS)
        .findOne({ email: rootUserConfig.email })

    // If root user not found, create it
    if (!rootUser) {
        if (!rootUserConfig.password) {
            throw new Error('Root user password not found!')
        }

        const user = await usersService.addUser(rootUserConfig as IUserPostBody)
        if (!user) {
            return
        }

        logger.info('Root user created.')

        return user
    }

    return rootUser as IUser
}

// If 'res' argument not spesified, the function will add user with 'admin' status
async function addUser(
    body: IUserPostBody,
    res?: Response
): Promise<IUser | void> {
    const hashedPassword: string = await bcrypt.hash(body.password, 10)

    const userObj: IUserPost = {
        ...body,
        password: hashedPassword,
        status: res ? 'user' : 'admin',
        active: !res,
        subscription: 'free',
        keywords: getKeywords(body.email, body.name),
    }

    const result = await db.collection(entity).insertOne(userObj)
    const user = await db.collection(entity).findOne({ _id: result.insertedId })

    if (!user && res) {
        return apiUtils.sendError(res, errors.DOC_NOT_FOUND)
    }

    return user as IUser
}

async function getUserByEmail(email: string, res: Response) {
    const result = await db.collection(entity).findOne({ email })

    return result
}

async function activateUser(userId: string, res: Response) {
    const result = await db
        .collection(entity)
        .findOneAndUpdate(
            { _id: new ObjectId(userId), active: false },
            { $set: { active: true } },
            { returnDocument: 'after', upsert: false }
        )

    if (!result.ok) {
        return apiUtils.sendError(res, errors.DOC_NOT_FOUND)
    }

    return result.value
}

// Delete inactive users older 24 hours
async function deleteInactiveUsers() {
    const result = await db.collection(entity).deleteMany({
        active: false,
        createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 },
    })

    logger.info(
        `Cron: Deleted inactive users older 24 hours: ${result.deletedCount}`
    )
}

export const usersService = {
    countUsersByState,
    getRootUser,
    addUser,
    activateUser,
    deleteInactiveUsers,
    getUserByEmail,
}
