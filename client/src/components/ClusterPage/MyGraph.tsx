import Graph from 'react-graph-vis'
import { useCallback, useContext, useEffect } from 'react'
import { clusterContext } from '../../context'
import {
    IHoverEvent,
    ISelectEvent,
    IStabilizedEvent,
} from '../../utils/interfaces/_events'
import { Utils } from '../../utils/utils'
import { usePutNodes } from '../../hooks/store/nodes.api'
import { KEYBOARD } from '../../utils/constants'

export default function MyGraph() {
    const {
        clusterId,
        darkThemeEnabledState: [darkThemeEnabled, setDarkThemeEnabled],
        nodesState: [nodes, setNodes],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        edgesState: [edges, setEdges],
        hoveredNodeIdState: [hoveredNodeId, setHoveredNodeId],
        hierarchicalEnabledState: [hierarchicalEnabled, setHierarchinalEnabled],
        networkState: [network, setNetwork],
        updateConnection,
        deselectNodes,
        isUpdateNodeFormVisibleState: [
            isUpdateNodeFormVisible,
            setIsUpdateNodeFormVisible,
        ],
    } = useContext(clusterContext)

    const putNodesPosition = usePutNodes()

    const options = {
        autoResize: true,
        physics: {
            stabilization: true,
            wind: { x: 0, y: 0 },
        },
        layout: {
            hierarchical: hierarchicalEnabled,
        },
        nodes: {
            borderWidth: 4,
            size: 30,
            shape: 'dot',
            color: {
                border: darkThemeEnabled ? '#666666' : '#222222',
                background: darkThemeEnabled ? '#999999' : '#666666',
            },
            font: { color: darkThemeEnabled ? '#999999' : '#666666' },
        },
        edges: {
            color: darkThemeEnabled ? '#999999' : '#666666',
            smooth: {
                enabled: true,
                // type: 'cubicBezier'
            },
            arrows: {
                to: {
                    enabled: true,
                },
            },
        },
        height: window.innerHeight.toString(),
        interaction: {
            hover: !hierarchicalEnabled,
        },
    }

    const onEscKeyDown = (event: KeyboardEvent) => {
        if (selectedNodeId && event.key === 'Escape') {
            deselectNodes()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', onEscKeyDown)

        return () => {
            window.removeEventListener('keydown', onEscKeyDown)
        }
    }, [selectedNodeId])

    const onStabilized = useCallback(
        async function ({ iterations }: IStabilizedEvent) {
            if (iterations > 100) {
                const nodesObject = network.body.nodes

                const body = Object.keys(nodesObject)
                    .filter((id: string) => !id.includes('edgeId'))
                    .map((id: string) => ({
                        id,
                        x: nodesObject[id].x,
                        y: nodesObject[id].y,
                    }))

                putNodesPosition(body)
            }
        },
        [nodes]
    )

    const onDoubleClick = useCallback(() => {
        setIsUpdateNodeFormVisible(true)
    }, [nodes])

    const events = {
        select: function ({ nodes, edges, event }: ISelectEvent) {
            if (!nodes.length) {
                setSelectedNodeId(null)
                return
            }

            if (selectedNodeId && event.changedPointers[0][KEYBOARD.CTRL_KEY]) {
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
        stabilized: onStabilized,
        doubleClick: onDoubleClick,
    }

    return (
        <div
            className="graph-container"
            style={{ background: darkThemeEnabled ? '#222222' : 'white' }}
        >
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

                        const connections = edges.filter(
                            (edge) =>
                                edge.from === node.id || edge.to === node.id
                        )

                        return {
                            ...node,
                            title: node.description,
                            font: { color: node.color },
                            border: node.image ? 4 : 2,
                            size: node.image
                                ? 20 + connections.length * 1.5
                                : 15 + connections.length * 1.5,
                        }
                    }),
                    edges,
                }}
                options={options}
                events={events}
                getNetwork={setNetwork}
            />
        </div>
    )
}
