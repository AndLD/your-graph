import { Request, Response } from 'express'
import { getLogger } from '../utils/logger'

const logger = getLogger('middlewares/logger')

export function loggerMiddleware(req: Request, _: Response, next: any) {
    logger.info(`${req.method}, ${req.url}`)
    next()
}
