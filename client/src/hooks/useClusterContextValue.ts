import { useEffect, useState } from 'react'
import {
    IConnection,
    IConnectionBackend,
    ID,
    INode,
    INodeBackend,
    ISource,
    ISourceBackend
} from '../helpers/interfaces'
import axios from 'axios'
import dayjs from 'dayjs'

export default function useClusterContextValue() {
    const darkThemeEnabledState = useState(JSON.parse(localStorage.getItem('darkThemeEnabled') || 'false'))
    const selectedNodeIdState = useState<null | ID>(null)
    const hoveredNodeIdState = useState<null | ID>(null)

    const nodesState = useState<INode[]>([])
    const edgesState = useState<IConnection[]>([])

    const hierarchicalEnabledState = useState(false)

    const networkState = useState<any>(null)

    const sourcesState = useState<ISource[]>([])

    const isUpdateNodeFormVisibleState = useState(false)

    useEffect(() => {
        // Fetch nodes from the server
        axios
            .get('/api/nodes')
            .then((response) => {
                const { data }: { data: INodeBackend[] } = response
                // Update the nodesState with the fetched nodes
                nodesState[1](
                    data.map(({ _id, ...node }) => {
                        const modified: INode = {
                            id: _id,
                            ...node
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
            })
            .catch((error) => {
                console.error('Failed to fetch nodes:', error)
            })

        // Fetch connections from the server
        axios
            .get('/api/connections')
            .then((response) => {
                const { data }: { data: IConnectionBackend[] } = response
                // Update the edgesState with the fetched connections
                edgesState[1](data.map(({ _id, ...rest }) => ({ id: _id, ...rest })))
            })
            .catch((error) => {
                console.error('Failed to fetch connections:', error)
            })

        // Fetch sources from the server
        axios
            .get('/api/sources')
            .then((response) => {
                const { data }: { data: ISourceBackend[] } = response
                // Update the edgesState with the fetched connections
                sourcesState[1](data.map(({ _id, ...rest }) => ({ id: _id, ...rest })))
            })
            .catch((error) => {
                console.error('Failed to fetch connections:', error)
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
        const [selectedNodeId] = selectedNodeIdState
        const [edges, setEdges] = edgesState

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

    return {
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
        isUpdateNodeFormVisibleState
    }
}
