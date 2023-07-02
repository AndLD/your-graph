import { Router } from 'express'
import { nodesControllers } from '../controllers/nodes'
import { upload } from '../utils/multer'

export const nodesRouter = Router()
    .get('/', nodesControllers.get)
    .post('/', upload.single('image'), nodesControllers.post)
    .put('/:id', upload.single('image'), nodesControllers.put)
    .put('/', nodesControllers.putPositions)
    .delete('/:id', nodesControllers.deleteOne)
