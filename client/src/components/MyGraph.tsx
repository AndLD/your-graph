import Graph from 'react-graph-vis'
import { useContext } from 'react'
import { appContext } from '../context'
import { ID, IEvent } from '../helpers/interfaces'
import { randomInteger } from '../helpers/utils'

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

export default function MyGraph() {
    const {
        nodesState: [nodes, setNodes],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        edgesState: [edges, setEdges]
    } = useContext(appContext)

    function updateConnection(to: ID) {
        // Selected node exists and it was not selected twice
        if (selectedNodeId && selectedNodeId !== to) {
            const connection = edges.find(
                (edge) =>
                    (edge.from === selectedNodeId && edge.to === to) || (edge.from === to && edge.to === selectedNodeId)
            )

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
        <Graph
            graph={{
                nodes,
                edges
            }}
            options={options}
            events={events}
        />
    )
}
