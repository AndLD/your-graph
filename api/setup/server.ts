import { setupApp } from './app'
import httpServer from 'http'
import { setupRouters } from './routers'

export function setupServer() {
    const app = setupApp()
    setupRouters(app)

    const server = httpServer.createServer(app)
    /* ...Here you can attach socket server... */

    return server
}
