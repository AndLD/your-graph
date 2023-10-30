import httpServer from 'http'
import dotenv from 'dotenv'
dotenv.config()
import { getLogger } from '../utils/logger'
import { setupServer } from '../setup/server'
import { environment } from '../utils/constants'
import { dbService, mongoClient } from '../services/db'
import { emailService } from '../services/email'
import { usersService } from '../services/users'
import { cronService } from '../services/cron'
import { clustersService } from '../services/clusters'
import packageJson from '../package.json'

let server: httpServer.Server | null = null
const port = process.env.PORT || 8080

export async function startApp() {
    const logger = getLogger('setup/index')

    logger.info(`${packageJson.name} ${packageJson.version}. Starting app...`)

    server = setupServer()

    await dbService.init()
    emailService.init()

    cronService.addJob(usersService.deleteInactiveUsers, 1)
    cronService.addJob(clustersService.deleteOldClustersFromTrashbox, 1)

    server.listen(port, () => {
        logger.info(`Server has been started on ${port}, env=${environment}`)
    })
}

export async function stopApp() {
    cronService.stop()
    emailService.stop()

    if (server) {
        server.close()
    }

    await mongoClient.close()
}
