import { Button, Tooltip } from 'antd'
import { useContext, useState, useEffect } from 'react'
import { clusterContext } from '../../../context'
import { useMessages } from '../../../utils/messages'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons'
import { usePostNode } from '../../../hooks/store/nodes.api'

export default function AddNodeBtn() {
    const {
        nodesState: [nodes, setNodes],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        selectNode,
    } = useContext(clusterContext)

    const [action, setAction] = useState<((param?: any) => any) | null>(null)

    const postNode = usePostNode((id) => {
        successMessage()
        setAction(() => {
            selectNode(id)
        })
    })

    useEffect(() => {
        if (action) {
            action()
            setAction(null)
        }
    }, [nodes])

    const { successMessage, errorMessage, contextHolder } = useMessages()

    return (
        <div style={{ margin: 10 }}>
            {contextHolder}
            {selectedNodeId ? (
                <div
                    style={{
                        width: 91.95,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Tooltip title="Add parent">
                        <Button
                            style={{ width: 40 }}
                            type="primary"
                            onClick={() => postNode('parent')}
                            icon={<LoginOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Add child">
                        <Button
                            style={{ width: 40 }}
                            type="primary"
                            onClick={() => postNode('child')}
                            icon={<LogoutOutlined />}
                        />
                    </Tooltip>
                </div>
            ) : (
                <Button type="primary" onClick={() => postNode()}>
                    Add node
                </Button>
            )}
        </div>
    )
}
