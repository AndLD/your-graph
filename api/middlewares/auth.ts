import { NextFunction, Response } from 'express'
import { getLogger } from '../utils/logger'
import jwt from 'jsonwebtoken'
import { accessJwtSecret } from '../utils/jwt'
import { apiUtils } from '../utils/api'
import { errors } from '../utils/constants'

const logger = getLogger('middlewares/auth')

export async function isAuthorized(req: any, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        return apiUtils.sendError(res, errors.AUTHORIZATION_HEADER_EMPTY)
    }

    const token: string = req.headers.authorization.split(' ')[1] as string

    try {
        const decodeValue: any = jwt.verify(token, accessJwtSecret)

        // TODO: Validate decodeValue ?

        req.user = decodeValue.user
    } catch (e) {
        logger.error(e)
        return apiUtils.sendError(res, errors.JWT_INVALID)
    }

    next()
}

export function isActive(req: any, res: Response, next: NextFunction) {
    const active = req.user?.active

    if (active) {
        return next()
    }

    return res.sendStatus(403)
}

export function hasUserStatus(req: any, res: Response, next: NextFunction) {
    const status = req.user?.status

    if (!status) {
        return res.sendStatus(500)
    }

    if (status === 'user' || status === 'moderator' || status === 'admin') {
        return next()
    }

    return res.sendStatus(403)
}

export function hasModeratorStatus(req: any, res: Response, next: NextFunction) {
    const status = req.user?.status

    if (!status) {
        return res.sendStatus(500)
    }

    if (status === 'moderator' || status === 'admin') {
        return next()
    }

    return res.sendStatus(403)
}

export function hasAdminStatus(req: any, res: Response, next: NextFunction) {
    const status = req.user?.status

    if (!status) {
        return res.sendStatus(500)
    }

    if (status === 'admin') {
        return next()
    }

    return res.sendStatus(403)
}
