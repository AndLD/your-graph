import Graph from 'react-graph-vis'
import { useCallback, useContext } from 'react'
import { appContext } from '../context'
import { ID, IHoverEvent, ISelectEvent, IStabilizedEvent } from '../helpers/interfaces'
import axios from 'axios'
import { Utils } from '../helpers/utils'

export default function MyGraph() {
    const {
        nodesState: [nodes, setNodes],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        edgesState: [edges, setEdges],
        hoveredNodeIdState: [hoveredNodeId, setHoveredNodeId],
        hierarchicalEnabledState: [hierarchicalEnabled, setHierarchinalEnabled],
        networkState: [network, setNetwork]
    } = useContext(appContext)

    const options = {
        physics: {
            stabilization: true,
            wind: { x: 0, y: 0 }
        },
        layout: {
            hierarchical: hierarchicalEnabled
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
                    enabled: true
                }
            }
        },
        height: window.innerHeight.toString(),
        interaction: {
            hover: !hierarchicalEnabled
        }
    }

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

    const stabilizedCallback = useCallback(
        async function ({ iterations }: IStabilizedEvent) {
            if (iterations > 100) {
                const nodesObject = network.body.nodes

                const body = Object.keys(nodesObject)
                    .filter((id: string) => !id.includes('edgeId'))
                    .map((id: string) => ({
                        _id: id,
                        x: nodesObject[id].x,
                        y: nodesObject[id].y
                    }))

                await axios.put('/api/nodes', body)
            }
        },
        [nodes]
    )

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
        blurNode: function () {
            setHoveredNodeId(null)
        },
        dragStart: function ({ nodes }: ISelectEvent) {
            if (nodes.length) {
                const nodeId = nodes[0]

                setSelectedNodeId(nodeId)
            }
        },
        stabilized: stabilizedCallback
    }

    return (
        <div className="graph-container">
            <Graph
                id="myGraph"
                graph={{
                    nodes: nodes.map((node) => {
                        if (node.title) {
                            node.label = Utils.getNodeLabel(node)
                        }
                        if (node.image) {
                            node.shape = 'circularImage'
                        }

                        const connections = edges.filter((edge) => edge.from === node.id || edge.to === node.id)

                        return {
                            ...node,
                            title: node.description,
                            font: { color: node.color },
                            border: node.image ? 4 : 2,
                            size: node.image ? 20 + connections.length * 1.5 : 15 + connections.length * 1.5
                        }
                    }),
                    edges
                }}
                options={options}
                events={events}
                getNetwork={setNetwork}
            />
        </div>
    )
}
