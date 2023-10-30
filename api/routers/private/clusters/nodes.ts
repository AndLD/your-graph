import { Router } from 'express'
import { nodesControllers } from '../../../controllers/clusters/nodes'
import { upload } from '../../../utils/multer'
import { quotaNotReached } from '../../../middlewares/users'

export const nodesRouter = Router({ mergeParams: true })
    .get('/', nodesControllers.get)
    .post(
        '/',
        quotaNotReached('nodes', 'clusterId'),
        upload.single('image'),
        nodesControllers.post
    )
    .put('/:id', upload.single('image'), nodesControllers.put)
    .put('/', nodesControllers.putPositions)
    .delete('/:id', nodesControllers.deleteOne)
