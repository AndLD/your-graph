import { Router } from 'express'
import { privateStatisticsControllers } from '../../controllers/private/statistics'
import { hasAdminStatus } from '../../middlewares/auth'

export const statisticsPrivateRouter = Router().get(
    '/',
    hasAdminStatus,
    privateStatisticsControllers.getStatistics
)
