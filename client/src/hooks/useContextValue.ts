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

export default function useContextValue() {
    const selectedNodeIdState = useState<null | ID>(null)
    const hoveredNodeIdState = useState<null | ID>(null)

    const nodesState = useState<INode[]>([])
    const edgesState = useState<IConnection[]>([])

    const hierarchicalEnabledState = useState(false)

    const networkState = useState<any>(null)

    const sourcesState = useState<ISource[]>([])

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

    function selectNode(nodeId: string, focus = false) {
        networkState[0].selectNodes([nodeId])

        if (focus) {
            networkState[0].focus(nodeId)
        }

        selectedNodeIdState[1](nodeId)
    }

    return {
        selectedNodeIdState,
        nodesState,
        edgesState,
        hoveredNodeIdState,
        hierarchicalEnabledState,
        networkState,
        selectNode,
        sourcesState
    }
}
