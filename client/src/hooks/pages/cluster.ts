import { useEffect, useState } from 'react'
import axios from 'axios'
import { ID } from '../../utils/types'
import { INode } from '../../utils/interfaces/nodes'
import { IConnection } from '../../utils/interfaces/connections'
import { ISource } from '../../utils/interfaces/sources'
import {
    ICluster,
    IFetchClusterResponse,
} from '../../utils/interfaces/clusters'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchCluster } from '../store/clusters.api'
import dayjs from 'dayjs'

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

    if (!clusterId) {
        return navigate('/clusters')
    }
    // Fetch whole cluster with all nodes, connections and sources from the server

    useFetchCluster((data: IFetchClusterResponse) => {
        console.log(data)
        clusterState[1](data.cluster)
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
                    modified.startDate = dayjs(node.startDate, 'DD.MM.YYYY')
                }
                if (node.endDate) {
                    modified.endDate = dayjs(node.endDate, 'DD.MM.YYYY')
                }

                return modified
            })
        )
        edgesState[1](
            data.connections.map(({ _id, ...rest }) => ({
                id: _id,
                ...rest,
            }))
        )
        sourcesState[1](
            data.sources.map(({ _id, ...rest }) => ({
                id: _id,
                ...rest,
            }))
        )
    })

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
