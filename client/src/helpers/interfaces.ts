import { Dayjs } from 'dayjs'

export type ID = number | string

export interface INodeBackend {
    _id: ID
    title?: string
    description?: string
    startDate?: string | null
    endDate?: string | null
    tags?: string[]
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
    x?: number
    y?: number
}

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

export interface ISelectEvent {
    nodes: ID[]
    edges: ID[]
    event: any
}

export interface IHoverEvent {
    node: string
}

export interface IStabilizedEvent {
    iterations: number
}
