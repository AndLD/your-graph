export type ID = number | string

export interface INode {
    id: ID
    label?: string
    title?: string
    description?: string
    tagIds?: ID[]
    image?: string
    color?: string

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

export interface IEvent {
    nodes: ID[]
    edges: ID[]
    event: any
}
