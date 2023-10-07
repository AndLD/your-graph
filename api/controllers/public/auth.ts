import { Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { db } from '../../services/db'
import { tryCatch } from '../../utils/decorators'
import { IAuthPostBody } from '../../utils/interfaces/auth'
import { entities, errors } from '../../utils/constants'
import { IUser, IUserState } from '../../utils/interfaces/user'
import { createJwt, refreshJwtSecret } from '../../utils/jwt'
import { apiUtils } from '../../utils/api'
import { ObjectId } from 'mongodb'

interface IRefreshJwtPayload extends jwt.JwtPayload {
    user: {
        _id: string
    }
}

async function postLogin(req: any, res: Response) {
    const body: IAuthPostBody = req.body

    const user: IUser = await db
        .collection(entities.USERS)
        .findOne({ email: body.email })

    if (!user) {
        return apiUtils.sendError(res, errors.CREDENTIALS_INVALID)
    }

    // Password check
    const isPasswordValid = await bcrypt.compare(body.password, user.password)

    if (!isPasswordValid) {
        return apiUtils.sendError(res, errors.CREDENTIALS_INVALID)
    }

    // JWT
    const userState: IUserState = {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        active: user.active,
        timestamp: user.timestamp,
        lastUpdateTimestamp: user.lastUpdateTimestamp,
    }

    const tokens = createJwt(userState)

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true })
    res.json({
        result: tokens.accessToken,
    })
}

async function postRefresh(req: any, res: Response) {
    const refreshToken = req.cookies.refreshToken

    console.log('refreshToken', refreshToken)

    if (!refreshToken) {
        return apiUtils.sendError(res, errors.UNABLE_TO_REFRESH_ACCESS_JWT)
    }

    // TODO: Investigate cases when jwt.verify can return a string ?
    try {
        var decodeValue: IRefreshJwtPayload = jwt.verify(
            refreshToken,
            refreshJwtSecret
        ) as IRefreshJwtPayload
    } catch (e) {
        return apiUtils.sendError(res, errors.UNABLE_TO_REFRESH_ACCESS_JWT)
    }
    if (!decodeValue?.user) {
        throw new Error('decodeValue.user is empty!')
    }

    console.log('decodeValue.user', decodeValue.user)

    const userId = decodeValue.user._id

    const user = await db
        .collection(entities.USERS)
        .findOne({ _id: new ObjectId(userId) })

    console.log('user', user)

    if (!user) {
        return res.sendStatus(401)
    }

    const userState: IUserState = {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        active: user.active,
        timestamp: user.timestamp,
        lastUpdateTimestamp: user.lastUpdateTimestamp,
    }

    const tokens = createJwt(userState)

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true })
    apiUtils.sendResult(res, tokens.accessToken)
}

async function postLogout(_: any, res: Response) {
    res.clearCookie('refreshToken')
    res.sendStatus(200)
}

export const authPublicControllers = {
    postLogin: tryCatch(postLogin),
    postRefresh: tryCatch(postRefresh),
    postLogout: tryCatch(postLogout),
}
