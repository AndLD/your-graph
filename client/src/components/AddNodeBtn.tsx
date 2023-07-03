import { Button, Tooltip } from 'antd'
import { useContext, useState, useEffect } from 'react'
import { appContext } from '../context'
import { useMessages } from '../helpers/messages'
import axios from 'axios'
import { INode } from '../helpers/interfaces'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons'

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

    function addNode(type?: 'child' | 'parent') {
        const body: any = {}
        const params: any = {}

        if (selectedNodeId) {
            const { x, y } = nodes.find((node) => node.id === selectedNodeId) as INode
            if (x) {
                body.x = x
            }
            if (y) {
                body.y = y
            }
            params.selectedNodeId = selectedNodeId
            params.type = type
        }

        // Make a POST request to add an empty node
        axios
            .post('/api/nodes', body, { params })
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
            {selectedNodeId ? (
                <div style={{ width: 91.95, display: 'flex', justifyContent: 'space-between' }}>
                    <Tooltip title="Add parent">
                        <Button
                            style={{ width: 40 }}
                            type="primary"
                            onClick={() => addNode('parent')}
                            icon={<LoginOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Add child">
                        <Button
                            style={{ width: 40 }}
                            type="primary"
                            onClick={() => addNode('child')}
                            icon={<LogoutOutlined />}
                        />
                    </Tooltip>
                </div>
            ) : (
                <Button type="primary" onClick={() => addNode()}>
                    Add node
                </Button>
            )}
        </div>
    )
}
