import {
    useDeleteNodeMutation,
    usePostNodeMutation,
    usePutNodeMutation,
    usePutNodesPositionMutation,
} from '../../store/nodes.api'
import {
    INode,
    INodeBackend,
    INodePositionPutBody,
    INodePut,
} from '../../utils/interfaces/nodes'
import { errorNotification } from '../../utils/notifications'
import { useContext } from 'react'
import { clusterContext } from '../../context'

export function usePutNodes(callback?: () => void) {
    const [putNodesPositionMutation] = usePutNodesPositionMutation()

    const { clusterId } = useContext(clusterContext)

    return (body: INodePositionPutBody[]) => {
        if (!clusterId) {
            return
        }

        putNodesPositionMutation({
            clusterId,
            body,
        }).then((value: any) => {
            const error = value.error?.msg || value.error?.data?.error

            if (error) {
                errorNotification(error, 'Put nodes position request failed')
            } else if (callback) {
                callback()
            }
        })
    }
}

export function usePostNode(callback: (id: string) => void) {
    const [postNodeMutation] = usePostNodeMutation()

    const {
        clusterId,
        nodesState: [nodes, setNodes],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        edgesState: [edges, setEdges],
    } = useContext(clusterContext)

    return (type?: 'child' | 'parent') => {
        if (!clusterId) {
            return
        }

        const body: any = {}

        if (selectedNodeId) {
            const { x, y } = nodes.find(
                (node) => node.id === selectedNodeId
            ) as INode
            if (x) {
                body.x = x
            }
            if (y) {
                body.y = y
            }
        }

        postNodeMutation({
            clusterId,
            selectedNodeId: selectedNodeId || undefined,
            type,
            body,
        }).then((value: any) => {
            if (value.data) {
                const { _id: nodeId, ...rest } = value.data.node

                // Update the nodesState by adding the new node
                setNodes([...nodes, { id: nodeId, ...rest }])

                if (selectedNodeId) {
                    const { _id: connectionId, ...rest } = value.data.connection

                    setEdges([...edges, { id: connectionId, ...rest }])
                }

                if (callback) {
                    callback(nodeId)
                }
            } else {
                const error = value.error?.msg || value.error?.data?.error
                errorNotification(error, 'Post cluster request failed')
            }
        })
    }
}

export function usePutNode(callback: (updatedNode: INodeBackend) => void) {
    const [putNodeMutation] = usePutNodeMutation()

    const {
        clusterId,
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
    } = useContext(clusterContext)

    return (body: INodePut) => {
        if (!clusterId || !selectedNodeId) {
            return
        }
        putNodeMutation({
            clusterId,
            selectedNodeId,
            body,
        })
            .then((value: any) => {
                if (value.data) {
                    callback(value.data)
                }
            })
            .catch((error) => {
                console.error('Failed to upload data: ' + error.message)
            })
    }
}

export function useDeleteNode(callback: () => void) {
    const [deleteNodeMutation] = useDeleteNodeMutation()

    const {
        clusterId,
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
    } = useContext(clusterContext)

    return () => {
        if (!clusterId || !selectedNodeId) {
            return
        }
        deleteNodeMutation({
            clusterId,
            selectedNodeId,
        })
            .then((value: any) => {
                if (value.data) {
                    callback()
                }
            })
            .catch((error) => {
                console.error('Failed to delete node:', error)
            })
    }
}
