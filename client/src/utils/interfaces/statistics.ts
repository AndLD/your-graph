import { UserStatus } from './user'

export interface IStatistics {
    startTimestamp: number
    users: { [key in UserStatus]: number }
    clustersTotal: number
    nodesTotal: number
    connectionsTotal: number
}

export interface IFetchStatisticsResponse {
    result: IStatistics
}
