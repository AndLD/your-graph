import { entities } from '../utils/constants'
import { getLogger } from '../utils/logger'
import { db } from './db'

const logger = getLogger('services/users')

const entity = entities.CLUSTERS

// Delete clusters which marked as 'deleted' and updatedAt is older than 30 days
async function deleteOldClustersFromTrashbox() {
    const result = await db.collection(entity).deleteMany({
        deleted: true,
        updatedAt: { $lt: Date.now() - 30 * 24 * 60 * 60 * 1000 },
    })

    logger.info(
        `Cron: Deleted clusters placed in trashbox more than 30 days ago: ${result.deletedCount}`
    )
}

export const clustersService = {
    deleteOldClustersFromTrashbox,
}
