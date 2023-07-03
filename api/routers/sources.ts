import { Router } from 'express'
import { sourcesControllers } from '../controllers/sources'

export const sourcesRouter = Router()
    .get('/', sourcesControllers.get)
    .post('/', sourcesControllers.post)
    .put('/:id', sourcesControllers.put)
    .delete('/:id', sourcesControllers.deleteOne)
