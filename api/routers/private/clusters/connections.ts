import { Router } from 'express'
import { connectionsControllers } from '../../../controllers/clusters/connections'

export const connectionsRouter = Router({ mergeParams: true })
    .get('/', connectionsControllers.get)
    .post('/', connectionsControllers.post)
    .put('/:id', connectionsControllers.put)
    .delete('/:id', connectionsControllers.deleteOne)
