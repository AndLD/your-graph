import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { tryCatch } from '../../utils/decorators'
import { IUserState, IUserPostBody } from '../../utils/interfaces/user'
import { createEmailVerificationJwt, createJwt, emailVerificationJwtSecret } from '../../utils/jwt'
import { usersService } from '../../services/users'
import { emailService } from '../../services/email'
import { apiUtils } from '../../utils/api'
import { errors } from '../../utils/constants'
import { getLogger } from '../../utils/logger'

const logger = getLogger('controllers/private/users')

async function postUser(req: any, res: Response) {
    const body: IUserPostBody = req.body

    const user = await usersService.addUser(body, res)
    if (!user) {
        return
    }

    const userState: IUserState = {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        active: user.active,
        timestamp: user.timestamp,
        lastUpdateTimestamp: user.lastUpdateTimestamp
    }

    const tokens = createJwt(userState)

    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true })

    if (!user.active) {
        emailService.sendEmailVerification(user.email, createEmailVerificationJwt(user.id))
    }

    res.json({
        result: tokens.accessToken
    })
}

async function getVerifyEmail(req: any, res: Response) {
    const token = req.query.token

    if (!token) {
        return apiUtils.sendError(res, errors.BAD_REQUEST)
    }

    try {
        const decodeValue: any = jwt.verify(token, emailVerificationJwtSecret)

        // TODO: Validate decodeValue ?

        const userId = decodeValue.user.id

        const updatedUser = await usersService.activateUser(userId, res)
        if (!updatedUser) {
            return
        }

        // notificationsService.sendNewUserNofication(updatedUser.name, updatedUser.email)

        res.sendStatus(200)
    } catch (e) {
        logger.error(e)
        return apiUtils.sendError(res, errors.JWT_INVALID)
    }
}

export const usersPublicControllers = {
    postUser: tryCatch(postUser),
    getVerifyEmail: tryCatch(getVerifyEmail)
}
