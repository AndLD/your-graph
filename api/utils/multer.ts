import multer from 'multer'
import { ObjectId } from 'mongodb'
import path from 'path'
import fs from 'fs'

// Define multer instance
const multerInstance = multer.diskStorage({
    destination: 'public/images/',
    filename: (req, file, cb) => {
        // Check if an id parameter is provided, if so use it instead of generating a new one
        let newObjectId: string
        if (req.params.id) {
            newObjectId = req.params.id
        } else {
            newObjectId = new ObjectId().toString()
            req.body._id = newObjectId
        }

        // Check if a file with the id already exists
        const files = fs.readdirSync('public/images')
        const fileToDelete = files.find((file) => file.startsWith(newObjectId))
        if (fileToDelete) {
            // If it exists, delete it
            fs.unlinkSync(path.join('public/images', fileToDelete))
        }

        req.body.image = path.extname(file.originalname)

        cb(null, newObjectId + path.extname(file.originalname))
    }
})

export const upload = multer({ storage: multerInstance })
