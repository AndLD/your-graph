import { Express, Router } from 'express'
import { nodesRouter } from '../routers/nodes'
import { connectionsRouter } from '../routers/connections'
import { sourcesRouter } from '../routers/sources'

export function setupRouters(app: Express) {
    const apiRouter = Router()
    app.use('/api', apiRouter)

    apiRouter.use('/nodes', nodesRouter)
    apiRouter.use('/connections', connectionsRouter)
    apiRouter.use('/sources', sourcesRouter)
}
