import { Router } from 'express'
import { connectionsControllers } from '../controllers/connections'

export const connectionsRouter = Router()
    .get('/', connectionsControllers.get)
    .post('/', connectionsControllers.post)
    .put('/:id', connectionsControllers.put)
    .delete('/:id', connectionsControllers.deleteOne)
