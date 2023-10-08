import { Express, Router } from 'express'
import { nodesRouter } from '../routers/private/clusters/nodes'
import { connectionsRouter } from '../routers/private/clusters/connections'
import { sourcesRouter } from '../routers/private/clusters/sources'
import usersPublicRouter from '../routers/public/users'
import { isAuthorized } from '../middlewares/auth'
import authPublicRouter from '../routers/public/auth'
import authPrivateRouter from '../routers/private/auth'
import { clustersPrivateRouter } from '../routers/private/clusters'
import { setReqEntity } from '../middlewares/decorators'
import { entities } from '../utils/constants'
import { clustersPublicRouter } from '../routers/public/clusters'
import { statisticsPrivateRouter } from '../routers/private/statistics'

export function setupRouters(app: Express) {
    const apiRouter = Router()
    app.use('/api', apiRouter)

    // Unauthorized router
    const publicRouter = Router()
    apiRouter.use('/public', publicRouter)

    publicRouter.use('/auth', authPublicRouter)
    publicRouter.use('/clusters', clustersPublicRouter)
    publicRouter.use('/users', setReqEntity(entities.USERS), usersPublicRouter)

    // Authorized router
    const privateRouter = Router()
    apiRouter.use('/private', isAuthorized, privateRouter)

    privateRouter.use('/auth', authPrivateRouter)
    privateRouter.use('/clusters', clustersPrivateRouter)
    privateRouter.use('/statistics', statisticsPrivateRouter)
}
