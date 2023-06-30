import { Router } from 'express'
import { edgesController } from '../controllers/edges'

export const edgesRouter = Router()
    .get('/', edgesController.post)
    .post('/', edgesController.post)
    .put('/:id', edgesController.put)
    .delete('/:id', edgesController.deleteOne)
