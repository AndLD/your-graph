import { useState, useEffect, useContext, useRef } from 'react'
import { Form, Button, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { clusterContext } from '../../context'
import Title from 'antd/es/typography/Title'
import { useMessages } from '../../utils/messages'
import { usePostNode } from '../../hooks/store/nodes.api'
import { PlusOutlined } from '@ant-design/icons'

export default function SelectCategoryModal() {
    const [form] = useForm()

    const {
        nodesState: [nodes, setNodes],
        selectNode,
        relationNewNodeState: [relationNewNode, setRelationNewNode],
        isSelectCategoryModalVisibleState: [
            isSelectCategoryModalVisible,
            setIsSelectCategoryModalVisible,
        ],
        isCreateCategoryModalVisibleState: [
            isCreateCategoryModalVisible,
            setIsCreateCategoryModalVisible,
        ],
        categoriesState: [categories, setCategories],
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
        <div className="form-container" style={{ top: 10, right: 10 }}>
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
                        categories.map((item: any, index: number) => (
                            <div
                                style={{ width: '70px', textAlign: 'center' }}
                                key={index}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#eeeeee',
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '50%',
                                    }}
                                    onClick={() => createNode()}
                                />
                                {item.title}
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
                            icon={<PlusOutlined style={{ fontSize: '28px' }} />}
                            onClick={openCreateCategoryModal}
                        />
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                }}
            >
                <div style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 10 }} onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
