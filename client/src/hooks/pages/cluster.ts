import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { ID } from '../../utils/types'
import { INode, INodeBackend } from '../../utils/interfaces/nodes'
import {
    IConnection,
    IConnectionBackend,
} from '../../utils/interfaces/connections'
import { ISource, ISourceBackend } from '../../utils/interfaces/sources'
import { ICluster } from '../../utils/interfaces/clusters'
import { useNavigate, useParams } from 'react-router-dom'

export default function useClusterContextValue() {
    const navigate = useNavigate()

    const darkThemeEnabledState = useState(
        JSON.parse(localStorage.getItem('darkThemeEnabled') || 'false')
    )

    const clusterId = useParams().id

    if (clusterId) {
        localStorage.setItem('lastOpenedCluster', clusterId)
    }

    const clusterState = useState<ICluster | null>(null)

    const selectedNodeIdState = useState<null | ID>(null)
    const hoveredNodeIdState = useState<null | ID>(null)

    const nodesState = useState<INode[]>([])
    const edgesState = useState<IConnection[]>([])

    const hierarchicalEnabledState = useState(false)

    const networkState = useState<any>(null)

    const sourcesState = useState<ISource[]>([])

    const isUpdateNodeFormVisibleState = useState(false)

    useEffect(() => {
        if (!clusterId) {
            return navigate('/clusters')
        }

        // Fetch whole cluster with all nodes, connections and sources from the server
        axios
            .get(`/api/private/clusters/${clusterId}`)
            .then((response) => {
                const {
                    data,
                }: {
                    data: {
                        cluster: ICluster
                        nodes: INodeBackend[]
                        connections: IConnectionBackend[]
                        sources: ISourceBackend[]
                    }
                } = response

                // Update the clusterState with the fetched cluster
                clusterState[1](data.cluster)

                // Update the nodesState with the fetched nodes
                nodesState[1](
                    data.nodes.map(({ _id, ...node }) => {
                        const modified: INode = {
                            id: _id,
                            ...node,
                        }

                        if (node.image) {
                            modified.image = `/images/${_id}${node.image}`
                        }
                        if (node.startDate) {
                            modified.startDate = dayjs(
                                node.startDate,
                                'DD.MM.YYYY'
                            )
                        }
                        if (node.endDate) {
                            modified.endDate = dayjs(node.endDate, 'DD.MM.YYYY')
                        }

                        return modified
                    })
                )

                // Update the edgesState with the fetched connections
                edgesState[1](
                    data.connections.map(({ _id, ...rest }) => ({
                        id: _id,
                        ...rest,
                    }))
                )

                // Update the edgesState with the fetched connections
                sourcesState[1](
                    data.sources.map(({ _id, ...rest }) => ({
                        id: _id,
                        ...rest,
                    }))
                )
            })
            .catch((error) => {
                console.log(error)
                navigate('/clusters')
            })
    }, [])

    useEffect(() => {
        localStorage.setItem('darkThemeEnabled', darkThemeEnabledState[0])
    }, [darkThemeEnabledState[0]])

    useEffect(() => {
        if (!selectedNodeIdState[0]) {
            isUpdateNodeFormVisibleState[1](false)
        }
    }, [selectedNodeIdState[0]])

    function selectNode(nodeId: string, focus = false) {
        networkState[0].selectNodes([nodeId])

        if (focus) {
            networkState[0].focus(nodeId)
        }

        selectedNodeIdState[1](nodeId)
    }

    function deselectNodes() {
        selectedNodeIdState[1](null)
        networkState[0].unselectAll()
    }

    function updateConnection(to: ID) {
        if (!clusterId) {
            return
        }

        const [selectedNodeId] = selectedNodeIdState
        const [edges, setEdges] = edgesState

        // Selected node exists and it was not selected twice
        if (selectedNodeId && selectedNodeId !== to) {
            const connection = edges.find(
                (edge) =>
                    (edge.from === selectedNodeId && edge.to === to) ||
                    (edge.from === to && edge.to === selectedNodeId)
            )

            // If connection already exists delete it otherwise create
            if (connection) {
                axios
                    .delete(
                        `/api/private/clusters/${clusterId}/connections/${connection.id}`
                    )
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
                    .post(
                        `/api/private/clusters/${clusterId}/connections`,
                        newConnection
                    )
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

    return {
        clusterId,
        darkThemeEnabledState,
        selectedNodeIdState,
        nodesState,
        edgesState,
        hoveredNodeIdState,
        hierarchicalEnabledState,
        networkState,
        selectNode,
        sourcesState,
        updateConnection,
        deselectNodes,
        isUpdateNodeFormVisibleState,
    }
}
