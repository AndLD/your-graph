import { ID } from '../types'

export interface IConnection {
    id: ID
    from: ID
    to: ID
    clusterId: ID
}
export interface IConnectionBackend {
    _id: ID
    from: ID
    to: ID
    clusterId: ID
}
export interface IConnectionPostBody {
    from: ID
    to: ID
}
