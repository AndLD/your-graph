import { ID } from '../types'

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
