import { ID } from '../types'

export interface ISource {
    id?: ID
    title: string
    link?: string | null
    clusterId: ID
}

export interface ISourceBackend {
    _id: ID
    title: string
    link?: string | null
    clusterId: ID
}
