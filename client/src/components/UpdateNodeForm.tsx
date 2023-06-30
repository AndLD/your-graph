import { useState, useEffect } from 'react'
import { DatePicker, Form, Input, Button, ColorPicker } from 'antd'
import { useForm } from 'antd/es/form/Form'
import EditableTags from './EditableTags'

interface INodeFormValues {
    title: string
    color: string
    description: string
    date: string
    tags: string[]
}

export default function UpdateNodeForm({ initialValues }: { initialValues?: INodeFormValues }) {
    const [form] = useForm()
    const [tags, setTags] = useState<string[]>(form.getFieldValue('tags'))

    useEffect(() => {
        setTags(form.getFieldValue('tags'))
    }, [form.getFieldValue('tags')])

    function submit() {
        form.validateFields().then((body) => {
            console.log(body)
        })
    }

    return (
        <div className="form-container">
            <Form form={form} initialValues={initialValues}>
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        {
                            required: true,
                            whitespace: true
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="color" label="Color" initialValue={'000000'}>
                    <ColorPicker />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name="date" label="Date">
                    <DatePicker />
                </Form.Item>

                <div key={'editableTags'} style={{ marginBottom: 20 }}>
                    <EditableTags
                        tags={tags}
                        onSave={(newTags) => {
                            form.setFieldsValue({ tags: newTags })
                        }}
                        isNewTagBtnVisible={true}
                    />
                </div>

                <Form.Item style={{ display: 'none' }} key={5} name="tags">
                    <div></div>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: 10 }} onClick={submit}>
                    Update
                </Button>
                <Button type="primary" danger>
                    Delete
                </Button>
            </div>
        </div>
    )
}
