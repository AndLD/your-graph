import { ID } from '../types'

export interface IConnection {
    id: ID
    from: ID
    to: ID
}
export interface IConnectionBackend {
    _id: ID
    from: ID
    to: ID
}
