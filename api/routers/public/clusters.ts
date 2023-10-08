import { Router } from 'express'
import { clustersControllers } from '../../controllers/clusters'

export const clustersPublicRouter = Router().get(
    '/:id',
    clustersControllers.getOneById
)
