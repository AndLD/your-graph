import { useState } from 'react'
import { IConnection, ID, INode } from '../helpers/interfaces'

export default function useContextValue() {
    const selectedNodeIdState = useState<null | ID>(null)

    const nodesState = useState<INode[]>([
        {
            id: 1,
            label: '9 мая',
            title: 'node 1 tootip text',
            image: 'sssr.png',
            shape: 'circularImage',
            color: 'red',
            font: {
                color: 'red'
            }
        },
        { id: 2, label: 'Node 2', title: 'node 2 tootip text' },
        { id: 3, label: 'Node 3', title: 'node 3 tootip text' },
        { id: 4, label: 'Node 4', title: 'node 4 tootip text' },
        { id: 5, label: 'Node 5', title: 'node 5 tootip text' }
    ])

    const edgesState = useState<IConnection[]>([
        { id: 1, from: 1, to: 2 },
        { id: 2, from: 1, to: 3 },
        { id: 3, from: 2, to: 4 },
        { id: 4, from: 2, to: 5 }
    ])

    return {
        selectedNodeIdState,
        nodesState,
        edgesState
    }
}
