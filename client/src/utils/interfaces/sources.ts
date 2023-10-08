import { ID } from '../types'

export interface ISource {
    id?: ID
    title: string
    link?: string | null
}

export interface ISourceBackend {
    _id: ID
    title: string
    link?: string | null
}
