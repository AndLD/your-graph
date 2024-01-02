import { Router } from 'express'
import { clustersControllers } from '../../../controllers/clusters'
import { nodesRouter } from './nodes'
import { connectionsRouter } from './connections'
import { sourcesRouter } from './sources'
import { quotaNotReached, userHasAccess } from '../../../middlewares/users'

export const clustersPrivateRouter = Router()
    .get('/', clustersControllers.getByUserId)
    .get('/:id', userHasAccess('clusters'), clustersControllers.getOneById)
    .get(
        '/using_aggregation/:id',
        userHasAccess('clusters'),
        clustersControllers.getOneById_using_aggregation
    )
    .post('/', quotaNotReached('clusters'), clustersControllers.post)
    .put('/:id', userHasAccess('clusters'), clustersControllers.put)
    .delete('/:id', userHasAccess('clusters'), clustersControllers.deleteOne)

    .use(
        '/:clusterId/nodes',
        userHasAccess('clusters', 'clusterId'),
        nodesRouter
    )
    .use(
        '/:clusterId/connections',
        userHasAccess('clusters', 'clusterId'),
        connectionsRouter
    )
    .use(
        '/:clusterId/sources',
        userHasAccess('clusters', 'clusterId'),
        sourcesRouter
    )
