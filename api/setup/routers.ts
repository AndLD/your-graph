import { Express, Router } from 'express'
import { nodesRouter } from '../routers/nodes'
import { connectionsRouter } from '../routers/connections'

export function setupRouters(app: Express) {
    const apiRouter = Router()
    app.use('/api', apiRouter)

    apiRouter.use('/nodes', nodesRouter)
    apiRouter.use('/connections', connectionsRouter)
}
