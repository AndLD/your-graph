import { ID } from '../types'
import { IConnectionBackend } from './connections'
import { INodeBackend } from './nodes'
import { ISourceBackend } from './sources'

export interface IClusterBackend {
    _id: ID
    title: string
    userId: string
    access: 'public' | 'private'
    deleted?: boolean
    createdAt: number
    updatedAt: number
}

export interface ICluster {
    _id: ID
    title: string
    userId: string
    access: 'public' | 'private'
    deleted?: boolean
    createdAt: number
    updatedAt: number
}

export interface IClusterPostBody {
    title: string
    access?: 'public' | 'private'
}

export interface IClusterPutBody {
    title?: string
    access?: 'public' | 'private'
    deleted?: boolean
}

export interface IFetchClustersResponse {
    result: ICluster[]
}

export interface IClusterDeleteResponse {
    result: { _id: ID }
}

export interface IFetchClusterResponse {
    cluster: ICluster
    nodes: INodeBackend[]
    connections: IConnectionBackend[]
    sources: ISourceBackend[]
}
