import { useState, useEffect, useContext } from 'react'
import { DatePicker, Form, Input, Button, ColorPicker, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import EditableTags from './EditableTags'
import axios from 'axios'
import { appContext } from '../context'
import { useMessages } from '../helpers/messages'
import dayjs from 'dayjs'
import { INode, INodeBackend } from '../helpers/interfaces'

const { Dragger } = Upload

export default function UpdateNodeForm() {
    const {
        nodesState: [nodes, setNodes],
        edgesState: [edges, setEdges],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId]
    } = useContext(appContext)

    const [isLoading, setIsLoading] = useState(false)
    const { successMessage, errorMessage, contextHolder } = useMessages()

    const [form] = useForm()
    const [tags, setTags] = useState<string[]>(form.getFieldValue('tags'))
    const [fileList, setFileList] = useState<any[]>([])

    useEffect(() => {
        setFileList([])

        if (selectedNodeId) {
            const selectedNode = nodes.find((node) => node.id === selectedNodeId)

            if (selectedNode) {
                const newFieldsValue = {
                    id: selectedNode.id,
                    title: selectedNode.title,
                    description: selectedNode.description,
                    color: selectedNode.color || '#000000',
                    tags: selectedNode.tags,
                    startDate: selectedNode.startDate ? dayjs(selectedNode.startDate, 'DD.MM.YYYY') : undefined,
                    endDate: selectedNode.endDate ? dayjs(selectedNode.endDate, 'DD.MM.YYYY') : undefined
                }
                if ((newFieldsValue.color as any)?.toHexString) {
                    newFieldsValue.color = (newFieldsValue.color as any).toHexString()
                }
                form.setFieldsValue(newFieldsValue)
            }
        }
    }, [selectedNodeId])

    useEffect(() => {
        setTags(form.getFieldValue('tags'))
    }, [form.getFieldValue('tags')])

    const uploadProps = {
        name: 'file',
        accept: '.png,.jpg',
        multiple: false,
        fileList,
        onChange(info: any) {
            let fileList = [...info.fileList]
            fileList = fileList.slice(-1) // We only want the last file
            setFileList(fileList)
        }
    }

    function updateNode() {
        if (!selectedNodeId) {
            return // If id is not available, do nothing
        }

        form.validateFields().then(async (body: any) => {
            setIsLoading(true)
            // const body: any = {}
            // Object.keys(rawBody).forEach((field) => {
            //     if (form.isFieldTouched(field)) {
            //         body[field] = rawBody[field]
            //     }
            // })

            if (body.color?.toHexString) {
                body.color = body.color.toHexString()
            }

            const data = { ...body }

            const formData = new FormData()

            if (data.tags) {
                data.tags = JSON.stringify(data.tags)
            }
            data.startDate = data.startDate ? data.startDate.format('DD.MM.YYYY') : null
            data.endDate = data.endDate ? data.endDate.format('DD.MM.YYYY') : null

            Object.keys(data).forEach((key) => {
                if (key === 'date' || (data[key] && key !== 'id')) {
                    formData.append(key, data[key])
                }
            })

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj)
            }

            try {
                const response = await axios.put(`http://localhost:8080/api/nodes/${selectedNodeId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                const updatedNode = response.data as INodeBackend

                successMessage()

                setNodes(
                    nodes.map((node) => {
                        if (node.id === selectedNodeId) {
                            const { _id, ...rest } = updatedNode
                            const newNode: INode = { id: selectedNodeId, ...rest }

                            if (updatedNode.image) {
                                newNode.image = `/images/${selectedNodeId}${updatedNode.image}`
                            }

                            return newNode as INode
                        }

                        return node
                    })
                )
            } catch (error: any) {
                errorMessage('Failed to upload data: ' + error.message)
                console.error('Failed to upload data: ' + error.message)
            }

            setFileList([])

            setIsLoading(false)
        })
    }

    function deleteNode() {
        if (!selectedNodeId) {
            return // If id is not available, do nothing
        }

        axios
            .delete(`http://localhost:8080/api/nodes/${selectedNodeId}`)
            .then((response) => {
                // Handle successful deletion

                successMessage()

                // Remove the deleted node from nodes state
                setNodes(nodes.filter(({ id }) => id !== selectedNodeId))

                // Remove any edges connected to the deleted node
                setEdges(edges.filter((edge) => edge.from !== selectedNodeId || edge.to !== selectedNodeId))

                setSelectedNodeId(null)
            })
            .catch((error) => {
                errorMessage('Failed to delete node:' + error)
                console.error('Failed to delete node:', error)
            })
    }

    return (
        <div className="form-container">
            {contextHolder}
            <Form form={form}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Item
                        style={{ width: '85%' }}
                        name="title"
                        rules={[
                            {
                                required: true,
                                whitespace: true
                            }
                        ]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>

                    <Form.Item name="color">
                        <ColorPicker />
                    </Form.Item>
                </div>

                <Form.Item name="description">
                    <Input.TextArea placeholder="Description" style={{ height: 100 }} />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Item name="startDate" style={{ width: '47%' }}>
                        <DatePicker placeholder="Start" />
                    </Form.Item>

                    <Form.Item name="endDate" style={{ width: '47%' }}>
                        <DatePicker placeholder="End" />
                    </Form.Item>
                </div>

                <div key={'editableTags'} style={{ marginBottom: 20 }}>
                    <EditableTags
                        tags={tags}
                        onSave={(newTags) => {
                            form.setFieldsValue({ tags: newTags })
                        }}
                        isNewTagBtnVisible={true}
                    />
                </div>

                <Form.Item>
                    <Dragger {...uploadProps} customRequest={() => true}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                </Form.Item>

                <Form.Item style={{ display: 'none' }} key={5} name="tags">
                    <div></div>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: 10 }} onClick={updateNode} loading={isLoading}>
                    Update
                </Button>
                <Button danger onClick={deleteNode}>
                    Delete
                </Button>
            </div>
        </div>
    )
}
