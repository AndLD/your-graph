import { Router } from 'express'
import { categoriesControllers } from '../../../controllers/clusters/categories'

export const categoriesRouter = Router({ mergeParams: true })
    .get('/', categoriesControllers.get)
    .post('/', categoriesControllers.post)
    .put('/:id', categoriesControllers.put)
    .delete('/:id', categoriesControllers.deleteOne)
