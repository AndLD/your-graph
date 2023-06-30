import Graph from 'react-graph-vis'
import { useContext } from 'react'
import { appContext } from '../context'
import { ID, IHoverEvent, ISelectEvent } from '../helpers/interfaces'
import dayjs from 'dayjs'
import axios from 'axios'

const options = {
    physics: {
        stabilization: true,
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
            enabled: true
            // type: 'cubicBezier'
        },
        arrows: {
            to: {
                enabled: false
            }
        }
    },
    height: window.innerHeight.toString(),
    interaction: {
        hover: true
    }
}

export default function MyGraph() {
    const {
        nodesState: [nodes, setNodes],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        edgesState: [edges, setEdges],
        hoveredNodeIdState: [hoveredNodeId, setHoveredNodeId]
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
                axios
                    .delete(`/api/connections/${connection.id}`)
                    .then((response) => {
                        // Upon successful deletion, remove from edges state
                        setEdges(edges.filter(({ id }) => id !== connection.id))
                    })
                    .catch((error) => {
                        console.error('Failed to delete connection:', error)
                    })
            } else {
                const newConnection = { from: selectedNodeId, to }
                axios
                    .post('/api/connections', newConnection)
                    .then((response) => {
                        const { _id, ...rest } = response.data

                        // Upon successful creation, add to edges state
                        setEdges([...edges, { id: _id, ...rest }])
                    })
                    .catch((error) => {
                        console.error('Failed to create connection:', error)
                    })
            }
        }
    }

    const events = {
        select: function ({ nodes, edges, event }: ISelectEvent) {
            if (!nodes.length) {
                setSelectedNodeId(null)
                return
            }

            if (selectedNodeId && event.changedPointers[0].ctrlKey) {
                updateConnection(nodes[0])
            }

            setSelectedNodeId(nodes[0])
        },
        hoverNode: function ({ node }: IHoverEvent) {
            setHoveredNodeId(node)
        },
        blurNode: function ({ node }: IHoverEvent) {
            setHoveredNodeId(null)
        }
    }

    return (
        <div className="graph-container">
            <Graph
                id="myGraph"
                graph={{
                    nodes: nodes.map((node) => {
                        if (node.title) {
                            node.label =
                                node.title +
                                (node.startDate
                                    ? '\n' +
                                      dayjs(node.startDate, 'DD.MM.YYYY').format('DD.MM.YYYY').toString() +
                                      (node.endDate
                                          ? ' - ' + dayjs(node.endDate, 'DD.MM.YYYY').format('DD.MM.YYYY').toString()
                                          : '')
                                    : '')
                        }
                        if (node.image) {
                            node.shape = 'circularImage'
                        }

                        return {
                            ...node,
                            title: node.description,
                            font: { color: node.color }
                        }
                    }),
                    edges
                }}
                options={options}
                events={events}
            />
        </div>
    )
}
