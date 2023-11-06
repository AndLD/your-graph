import { useState, useEffect, useContext, useRef } from 'react'
import { Form, Button, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { clusterContext } from '../../context'
import Title from 'antd/es/typography/Title'

export default function CreateCategoryModal() {
    const [form] = useForm()

    const {
        nodesState: [nodes, setNodes],
        selectNode,
        relationNewNodeState: [relationNewNode, setRelationNewNode],
        isCreateCategoryModalVisibleState: [
            isCreateCategoryModalVisible,
            setIsCreateCategoryModalVisible,
        ],
        categoriesState: [categories, setCategories],
    } = useContext(clusterContext)

    const [titleInput, setTitleInput] = useState('')

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTitleInput(event.target.value)
    }

    function createCategory() {
        setCategories([...categories, { title: titleInput }])
        setIsCreateCategoryModalVisible(false)
    }

    function onCancel() {
        setIsCreateCategoryModalVisible(false)
    }

    return (
        <div className="form-container">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Title level={3}>Create category</Title>
            </div>

            <Form form={form}>
                <Form.Item>
                    <Input
                        placeholder="title"
                        value={titleInput}
                        onChange={onChange}
                    />
                </Form.Item>
            </Form>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                }}
            >
                <div style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={createCategory}
                    >
                        Create
                    </Button>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 10 }} onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
