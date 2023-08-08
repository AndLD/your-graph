import { Express, Router } from 'express'
import { nodesRouter } from '../routers/nodes'
import { connectionsRouter } from '../routers/connections'
import { sourcesRouter } from '../routers/sources'
import usersPublicRouter from '../routers/public/users'
import { isAuthorized } from '../middlewares/auth'
import authPublicRouter from '../routers/public/auth'
import authPrivateRouter from '../routers/private/auth'
import { setReqEntity } from '../middlewares/decorators'
import { entities } from '../utils/constants'

export function setupRouters(app: Express) {
    const apiRouter = Router()
    app.use('/api', apiRouter)

    // Unauthorized router
    const publicRouter = Router()
    apiRouter.use('/public', publicRouter)

    publicRouter.use('/users', setReqEntity(entities.USERS), usersPublicRouter)
    publicRouter.use('/auth', authPublicRouter)

    // Authorized router
    const privateRouter = Router()
    apiRouter.use('/private', isAuthorized, privateRouter)

    privateRouter.use('/auth', authPrivateRouter)

    apiRouter.use('/nodes', nodesRouter)
    apiRouter.use('/connections', connectionsRouter)
    apiRouter.use('/sources', sourcesRouter)
}
