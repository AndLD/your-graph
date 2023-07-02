import { Button } from 'antd'
import { useContext, useState, useEffect } from 'react'
import { appContext } from '../context'
import { useMessages } from '../helpers/messages'
import axios from 'axios'
import { INode } from '../helpers/interfaces'

export default function AddNodeBtn() {
    const {
        nodesState: [nodes, setNodes],
        edgesState: [edges, setEdges],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        selectNode
    } = useContext(appContext)

    const [action, setAction] = useState<((param?: any) => any) | null>(null)

    useEffect(() => {
        if (action) {
            action()
            setAction(null)
        }
    }, [nodes])

    const { successMessage, errorMessage, contextHolder } = useMessages()

    function addNode() {
        const params: any = {}
        if (selectedNodeId) {
            params.selectedNodeId = selectedNodeId
        }

        // Make a POST request to add an empty node
        axios
            .post('http://localhost:8080/api/nodes', {}, { params })
            .then((response) => {
                successMessage()
                const { _id: nodeId, ...rest } = response.data.node

                // Update the nodesState by adding the new node
                setNodes([...nodes, { id: nodeId, ...rest }])

                if (selectedNodeId) {
                    const { _id: connectionId, ...rest } = response.data.connection

                    setEdges([...edges, { id: connectionId, ...rest }])
                    setAction(() => {
                        selectNode(nodeId)
                    })
                }
            })
            .catch((error) => {
                errorMessage('Failed to add node:' + error)
                console.error('Failed to add node:', error)
            })
    }

    return (
        <div style={{ margin: 10 }}>
            {contextHolder}
            <Button type="primary" onClick={addNode}>
                Add node
            </Button>
        </div>
    )
}
