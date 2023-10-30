import { ID } from '../types'

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
