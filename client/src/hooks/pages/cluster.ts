import { useEffect, useState } from 'react'
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
import {
    useDeleteConnection,
    usePostConnection,
} from '../store/connections.api'

export default function useClusterContextValue() {
    const navigate = useNavigate()

    const darkThemeEnabledState = useState(
        JSON.parse(localStorage.getItem('darkThemeEnabled') || 'false')
    )

    const clusterId = useParams().id

    const clusterState = useState<ICluster | null>(null)

    const selectedNodeIdState = useState<null | ID>(null)
    const hoveredNodeIdState = useState<null | ID>(null)

    const nodesState = useState<INode[]>([])
    const edgesState = useState<IConnection[]>([])

    const hierarchicalEnabledState = useState(false)

    const networkState = useState<any>(null)

    const sourcesState = useState<ISource[]>([])

    const isUpdateNodeFormVisibleState = useState(false)
    const isSelectCategoryModalVisibleState = useState(false)
    const isCreateCategoryModalVisibleState = useState(false)

    const fieldsForCategoryState = useState<{ label: string; type: string }[]>(
        []
    )

    const selectedCategoryState = useState<{ title: string } | null>({
        title: 'default',
    })

    const relationNewNodeState = useState<undefined | 'child' | 'parent'>()

    const categoriesState = useState([{ title: 'default' }])

    let postConnection: any = () => {}
    let deleteConnection: any = () => {}

    if (clusterId) {
        localStorage.setItem('lastOpenedCluster', clusterId)
        postConnection = usePostConnection(clusterId, edgesState)
        deleteConnection = useDeleteConnection(clusterId, edgesState)
        // Fetch whole cluster with all nodes, connections and sources from the server
        useFetchCluster((data: IFetchClusterResponse) => {
            clusterState[1](data.cluster)
            nodesState[1](
                data.nodes.map(({ _id, ...node }) => {
                    const modified: INode = {
                        id: _id,
                        ...node,
                    }

                    if (node.payload?.image) {
                        modified.image = `/images/${_id}${node.payload.image}`
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
            categoriesState[1](
                data.categories.map(({ _id, ...rest }) => ({
                    id: _id,
                    ...rest,
                }))
            )
        })
    } else {
        navigate('/clusters')
    }

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
        const [edges] = edgesState

        // Selected node exists and it was not selected twice
        if (selectedNodeId && selectedNodeId !== to) {
            const connection = edges.find(
                (edge) =>
                    (edge.from === selectedNodeId && edge.to === to) ||
                    (edge.from === to && edge.to === selectedNodeId)
            )

            // If connection already exists delete it otherwise create
            if (connection) {
                deleteConnection(connection.id)
            } else {
                const newConnection = { from: selectedNodeId, to, clusterId }
                postConnection(newConnection)
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
        isSelectCategoryModalVisibleState,
        isCreateCategoryModalVisibleState,
        relationNewNodeState,
        categoriesState,
        selectedCategoryState,
        fieldsForCategoryState,
    }
}
