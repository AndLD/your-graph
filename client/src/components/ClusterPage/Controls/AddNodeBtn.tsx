import { Button, Tooltip } from 'antd'
import { useContext } from 'react'
import { clusterContext } from '../../../context'
import { useMessages } from '../../../utils/messages'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons'

export default function AddNodeBtn() {
    const {
        selectedNodeIdState: [selectedNodeId],
        relationNewNodeState: [, setRelationNewNode],
        isSelectCategoryModalVisibleState: [, setIsSelectCategoryModalVisible],
    } = useContext(clusterContext)

    const { contextHolder } = useMessages()

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
                            className="select-category-modal-openbtn"
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
                            className="select-category-modal-openbtn"
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
                    className="select-category-modal-openbtn"
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
