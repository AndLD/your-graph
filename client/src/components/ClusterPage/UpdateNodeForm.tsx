import { useState, useEffect, useContext, useRef } from 'react'
import { DatePicker, Form, Input, Button, ColorPicker, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import EditableTags from './EditableTags'
import { clusterContext } from '../../context'
import { useMessages } from '../../utils/messages'
import dayjs from 'dayjs'
import SourcesSelect from './SourcesSelect/SourcesSelect'
import { INode, INodePut } from '../../utils/interfaces/nodes'
import { useDeleteNode, usePutNode } from '../../hooks/store/nodes.api'

const { Dragger } = Upload

export default function UpdateNodeForm() {
    const {
        nodesState: [nodes, setNodes],
        edgesState: [edges, setEdges],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
    } = useContext(clusterContext)

    const updateBtnRef = useRef<HTMLElement>(null)

    const [isLoading, setIsLoading] = useState(false)
    const { successMessage, contextHolder } = useMessages()

    const [form] = useForm()
    const [tags, setTags] = useState<string[]>(form.getFieldValue('tags'))
    const [fileList, setFileList] = useState<any[]>([])

    const putNode = usePutNode((updatedNode) => {
        successMessage()

        setNodes(
            nodes.map((node) => {
                if (node.id === selectedNodeId) {
                    const { _id, ...rest } = updatedNode
                    const newNode: INode = {
                        id: selectedNodeId,
                        ...rest,
                    }

                    if (updatedNode.image) {
                        newNode.image = `/images/${selectedNodeId}${updatedNode.image}`
                    }

                    return newNode as INode
                }

                return node
            })
        )
    })

    const deleteNode = useDeleteNode(() => {
        // Handle successful deletion
        successMessage()

        // Remove the deleted node from nodes state
        setNodes(nodes.filter(({ id }) => id !== selectedNodeId))

        // Remove any edges connected to the deleted node
        setEdges(
            edges.filter(
                (edge) =>
                    edge.from !== selectedNodeId || edge.to !== selectedNodeId
            )
        )

        setSelectedNodeId(null)
    })

    // TODO: Handle situation, when user just move cursor to new line in description field. In this case it should not submit the form.
    const onEnterKeyDown = (event: KeyboardEvent) => {
        if (updateBtnRef.current && event.key === 'Enter') {
            updateBtnRef.current.click()
        }
    }

    // useEffect(() => {
    //     window.addEventListener('keydown', onEnterKeyDown)

    //     return () => {
    //         window.removeEventListener('keydown', onEnterKeyDown)
    //     }
    // }, [])

    useEffect(() => {
        setFileList([])

        if (selectedNodeId) {
            const selectedNode = nodes.find(
                (node) => node.id === selectedNodeId
            )

            if (selectedNode) {
                const newFieldsValue = {
                    id: selectedNode.id,
                    title: selectedNode.title,
                    description: selectedNode.description,
                    color: selectedNode.color,
                    tags: selectedNode.tags,
                    startDate: selectedNode.startDate
                        ? dayjs(selectedNode.startDate, 'DD.MM.YYYY')
                        : undefined,
                    endDate: selectedNode.endDate
                        ? dayjs(selectedNode.endDate, 'DD.MM.YYYY')
                        : undefined,
                    sourceIds: selectedNode.sourceIds,
                }
                if ((newFieldsValue.color as any)?.toHexString) {
                    newFieldsValue.color = (
                        newFieldsValue.color as any
                    ).toHexString()
                }
                form.setFieldsValue(newFieldsValue)
            }

            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
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

            fileList = fileList.map((file) => {
                file.status = 'success'

                return file
            })

            if (fileList.length) setFileList(fileList)
        },
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
            if (data.sourceIds) {
                data.sourceIds = JSON.stringify(data.sourceIds)
            }
            data.startDate = data.startDate
                ? data.startDate.format('DD.MM.YYYY')
                : null
            data.endDate = data.endDate
                ? data.endDate.format('DD.MM.YYYY')
                : null

            Object.keys(data).forEach((key) => {
                if (data[key] !== undefined && key !== 'id') {
                    formData.append(key, data[key])
                }
            })

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj)
            }

            putNode(formData as INodePut)

            setFileList([])
            setIsLoading(false)
        })
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Delete' && selectedNodeId) {
            deleteNode()
        }
    }

    return (
        <div className="form-container">
            {contextHolder}
            <Form form={form}>
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Form.Item
                        style={{ width: '85%' }}
                        name="title"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>

                    <Form.Item name="color">
                        <ColorPicker allowClear />
                    </Form.Item>
                </div>

                <Form.Item name="description">
                    <Input.TextArea
                        showCount={true}
                        placeholder="Description"
                        style={{ height: 100 }}
                    />
                </Form.Item>

                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Form.Item name="startDate" style={{ width: '47%' }}>
                        <DatePicker placeholder="Start" format="DD.MM.YYYY" />
                    </Form.Item>

                    <Form.Item name="endDate" style={{ width: '47%' }}>
                        <DatePicker placeholder="End" format="DD.MM.YYYY" />
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
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Dragger>
                </Form.Item>

                <Form.Item name="sourceIds">
                    <SourcesSelect form={form} />
                </Form.Item>

                <Form.Item style={{ display: 'none' }} key={5} name="tags">
                    <div></div>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'right' }}>
                <Button
                    type="primary"
                    style={{ marginRight: 10 }}
                    onClick={updateNode}
                    loading={isLoading}
                    ref={updateBtnRef}
                >
                    Update
                </Button>
                <Button danger onClick={deleteNode}>
                    Delete
                </Button>
            </div>
        </div>
    )
}
