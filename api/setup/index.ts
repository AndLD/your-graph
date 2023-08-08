import httpServer from 'http'
import dotenv from 'dotenv'
dotenv.config()
import { getLogger } from '../utils/logger'
import { setupServer } from '../setup/server'
import { environment } from '../utils/constants'
import { dbService, mongoClient } from '../services/db'
import { emailService } from '../services/email'

let server: httpServer.Server | null = null
const port = process.env.PORT || 8080

export async function startApp() {
    const logger = getLogger('setup/index')

    server = setupServer()

    await dbService.init()
    emailService.init()

    server.listen(port, () => {
        logger.info(`Server has been started on ${port}, env=${environment}`)
    })
}

export async function stopApp() {
    emailService.stop()

    if (server) {
        server.close()
    }

    await mongoClient.close()
}
