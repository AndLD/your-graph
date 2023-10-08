import { Dayjs } from 'dayjs'
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

export interface INode {
    id: ID
    label?: string
    title?: string
    description?: string
    startDate?: Dayjs | string | null
    endDate?: Dayjs | string | null
    tags?: string[]
    image?: string
    color?: string | { border: string; background: string }

    group?: string
    shape?: string
    font?: object
    sourceIds?: string[]
    x?: number
    y?: number
}
