import { Router } from 'express'
import { nodesController } from '../controllers/nodes'
import { upload } from '../utils/multer'

export const nodesRouter = Router()
    .get('/', upload.single('image'), nodesController.post)
    .post('/', nodesController.post)
    .put('/:id', nodesController.put)
    .delete('/:id', nodesController.deleteOne)
