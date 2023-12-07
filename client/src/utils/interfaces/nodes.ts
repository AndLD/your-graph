import { Dayjs } from 'dayjs'
import { ID } from '../types'

type INodePayload = {
    title?: string
    description?: string
    startDate?: Dayjs | string | null
    endDate?: Dayjs | string | null
    tags?: string[]
    image?: string
    color?: string | { border: string; background: string }
} & { [key: string]: Dayjs | string | null }

export interface INodeBackend {
    _id: ID
    payload: INodePayload
    sourceIds?: string[]
    clusterId: ID
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

export interface INodePositionPutBody {
    id: ID
    x: number
    y: number
}

export interface INode {
    id: ID
    label?: string
    payload: INodePayload
    clusterId: ID

    group?: string
    shape?: string
    font?: object
    sourceIds?: string[]
    x?: number
    y?: number
}
