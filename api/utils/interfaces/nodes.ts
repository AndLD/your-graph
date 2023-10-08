import { ID } from '../types'

export interface INodeBackend {
    _id: ID
    title?: string
    description?: string
    startDate?: string | null
    endDate?: string | null
    tags?: string[]
    sourceIds?: string[]
    image?: string
    color?: string
}

export interface INodeFormValues {
    id?: ID
    title?: string
    color?: string
    description?: string
    startDate?: string | null
    endDate?: string | null
    tags?: string[]
}

export interface INodePut {
    title?: string
    color?: string
    description?: string
    startDate?: string | null
    endDate?: string | null
    tags?: string[]
    sourceIds?: string[]
}
