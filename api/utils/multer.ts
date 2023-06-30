import multer from 'multer'
import { ObjectId } from 'mongodb'

// Define multer instance
const multerInstance = multer.diskStorage({
    destination: 'public/images/',
    filename: (req, file, cb) => {
        const newObjectId = ObjectId.generate().toString()
        req.body._id = newObjectId
        cb(null, newObjectId)
    }
})

export const upload = multer({ storage: multerInstance })
