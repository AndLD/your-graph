import { Button, Tooltip } from 'antd'
import { useContext, useState, useEffect } from 'react'
import { clusterContext } from '../../../context'
import { useMessages } from '../../../utils/messages'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons'
import { usePostNode } from '../../../hooks/store/nodes.api'

export default function AddNodeBtn() {
    const {
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        selectNode,
        relationNewNodeState: [relationNewNode, setRelationNewNode],
        isSelectCategoryModalVisibleState: [
            isSelectCategoryModalVisible,
            setIsSelectCategoryModalVisible,
        ],
    } = useContext(clusterContext)

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
                            onClick={() => {
                                setRelationNewNode('parent')
                                setIsSelectCategoryModalVisible(true)
                            }}
                            icon={<LoginOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Add child">
                        <Button
                            style={{ width: 40 }}
                            type="primary"
                            onClick={() => {
                                setRelationNewNode('child')
                                setIsSelectCategoryModalVisible(true)
                            }}
                            icon={<LogoutOutlined />}
                        />
                    </Tooltip>
                </div>
            ) : (
                <Button
                    type="primary"
                    onClick={() => {
                        setRelationNewNode(undefined)
                        setIsSelectCategoryModalVisible(true)
                    }}
                >
                    Add node
                </Button>
            )}
        </div>
    )
}
