import { Router } from 'express'
import { sourcesControllers } from '../../../controllers/clusters/sources'
import { quotaNotReached } from '../../../middlewares/users'

export const sourcesRouter = Router()
    .get('/', sourcesControllers.get)
    .post('/', quotaNotReached('sources', 'clusterId'), sourcesControllers.post)
    .put('/:id', sourcesControllers.put)
    .delete('/:id', sourcesControllers.deleteOne)
