import { ID } from '../types'

export interface IClusterBackend {
    _id: ID
    title: string
    userId: string
    access: 'public' | 'private'
    deleted: boolean
}

export interface IClusterPostBody {
    title: string
    description?: string
    userId: string
    access?: 'public' | 'private'
}

export interface IClusterPutBody {
    title?: string
    access?: 'public' | 'private'
    deleted?: boolean
}

export interface IClusterPut extends IClusterPutBody {
    updatedAt: number
}
