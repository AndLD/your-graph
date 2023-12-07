import { useState, useEffect, useContext } from 'react'
import { Button, Modal } from 'antd'
import { clusterContext } from '../../context'
import Title from 'antd/es/typography/Title'
import { useMessages } from '../../utils/messages'
import { usePostNode } from '../../hooks/store/nodes.api'
import { PlusOutlined } from '@ant-design/icons'

export default function SelectCategoryModal() {
    const {
        nodesState: [nodes],
        selectNode,
        relationNewNodeState: [relationNewNode, setRelationNewNode],
        isSelectCategoryModalVisibleState: [
            isSelectCategoryModalVisible,
            setIsSelectCategoryModalVisible,
        ],
        isCreateCategoryModalVisibleState: [, setIsCreateCategoryModalVisible],
        categoriesState: [categories],
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

    const { successMessage } = useMessages()

    function createNode() {
        postNode(relationNewNode)
        setIsSelectCategoryModalVisible(false)
        setRelationNewNode(undefined)
    }

    function onCancel() {
        setIsSelectCategoryModalVisible(false)
    }

    function openCreateCategoryModal() {
        setIsCreateCategoryModalVisible(true)
    }

    return (
        <Modal
            open={isSelectCategoryModalVisible}
            onCancel={onCancel}
            style={{ top: 60, right: -643, display: 'flex' }}
            zIndex={3}
            mask={false}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}
        >
            <div
                style={{
                    width: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Title level={3}>Choose category</Title>
                </div>

                <div style={{ height: '400px' }}>
                    <div
                        style={{
                            width: '300px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            rowGap: '15px',
                            columnGap: '45px',
                        }}
                    >
                        {categories &&
                            categories.map((category: any, index: number) => (
                                <div
                                    style={{
                                        width: '70px',
                                        textAlign: 'center',
                                    }}
                                    key={index}
                                >
                                    <div
                                        style={{
                                            backgroundColor: '#eeeeee',
                                            width: '70px',
                                            height: '70px',
                                            borderRadius: '50%',
                                        }}
                                        onClick={createNode}
                                    />
                                    {category.title}
                                </div>
                            ))}
                        <div
                            style={{
                                width: '70px',
                                height: '88px',
                                display: 'flex',
                                alignItems: 'start',
                            }}
                        >
                            <Button
                                style={{ width: '70px', height: '70px' }}
                                shape="circle"
                                icon={
                                    <PlusOutlined
                                        style={{ fontSize: '28px' }}
                                    />
                                }
                                onClick={openCreateCategoryModal}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
