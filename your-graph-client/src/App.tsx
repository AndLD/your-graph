import { Button } from 'antd'
import { useState } from 'react'
import Graph from 'react-graph-vis'

function randomInteger(min: number, max: number) {
    // получить случайное число от (min-0.5) до (max+0.5)
    const rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
}

type ID = number | string

interface INode {
    id: ID
    label?: string
    title?: string
    description?: string
    sourceIds?: ID[]
    image?: string
    color?: string

    group?: string
    shape?: string
    font?: object
    x?: number
    y?: number
}

interface IConnection {
    id: ID
    from: ID
    to: ID
}

interface IEvent {
    nodes: ID[]
    edges: ID[]
    event: any
}

const options = {
    physics: {
        stabilization: false,
        wind: { x: 0, y: 0 }
    },
    layout: {
        hierarchical: false
    },
    nodes: {
        borderWidth: 4,
        size: 30,
        shape: 'dot',
        color: {
            border: '#222222',
            background: '#666666'
        },
        font: { color: '#666666' }
    },
    edges: {
        color: '#666666',
        smooth: {
            enabled: true,
            type: 'cubicBezier'
        }
    },
    height: window.innerHeight.toString()
}

function App() {
    const [selectedNodeId, setSelectedNodeId] = useState<null | ID>(null)

    const [nodes, setNodes] = useState<INode[]>([
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

    const [edges, setEdges] = useState<IConnection[]>([
        { id: 1, from: 1, to: 2 },
        { id: 2, from: 1, to: 3 },
        { id: 3, from: 2, to: 4 },
        { id: 4, from: 2, to: 5 }
    ])

    function addNode() {
        setNodes([
            ...nodes,
            {
                id: randomInteger(0, 20000)
            }
        ])
    }

    function updateConnection(to: ID) {
        if (selectedNodeId) {
            const connection = edges.find((edge) => edge.from === selectedNodeId && edge.to === to)

            // If connection already exists delete it otherwise create
            if (connection) {
                setEdges(edges.filter(({ id }) => id !== connection.id))
            } else {
                setEdges([...edges, { id: randomInteger(0, 20000), from: selectedNodeId, to }])
            }
        }
    }

    const events = {
        select: function ({ nodes, edges, event }: IEvent) {
            if (!nodes.length) {
                setSelectedNodeId(null)
                return
            }

            if (selectedNodeId && event.changedPointers[0].ctrlKey) {
                updateConnection(nodes[0])
            }

            setSelectedNodeId(nodes[0])
        }
    }

    return (
        <>
            <Graph
                graph={{
                    nodes,
                    edges
                }}
                options={options}
                events={events}
            />
            <Button style={{ position: 'absolute', top: 50, left: 50 }} type="primary" onClick={addNode}>
                Add node
            </Button>
        </>
    )
}

export default App
