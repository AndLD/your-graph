import { Form, Input, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { usePostCluster } from '../../hooks/store/clusters.api'

interface IProps {
    isModalOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export default function ClusterCreateModal({ isModalOpenState }: IProps) {
    const [form] = useForm()
    const postCluster = usePostCluster()

    const handleOk = () => {
        form.validateFields().then(async (data: any) => {
            const body: any = {}

            Object.keys(data).forEach((key) => {
                if (data[key] !== undefined && key !== 'id') {
                    body[key] = data[key]
                }
            })

            console.log(body)

            postCluster(body)
            form.resetFields()
        })

        isModalOpenState[1](false)
    }

    const handleCancel = () => {
        isModalOpenState[1](false)
    }
    return (
        <Modal
            title="Create new cluster"
            open={isModalOpenState[0]}
            onOk={handleOk}
            style={{
                top: '50%',
                transform: 'translateY(-50%)',
            }}
            onCancel={handleCancel}
        >
            {/* <ClusterCreateForm form={form} /> */}
            <Form form={form}>
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Form.Item
                        style={{ width: '100%' }}
                        name="title"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input placeholder="Title" maxLength={100} />
                    </Form.Item>
                </div>
                <Form.Item name="description">
                    <Input.TextArea
                        showCount={true}
                        placeholder="Description"
                        style={{ height: 100 }}
                        maxLength={200}
                    />
                </Form.Item>
                <Form.Item name="access">
                    <Select
                        placeholder="access"
                        style={{ width: 120 }}
                        options={[
                            { value: 'public', label: 'public' },
                            { value: 'private', label: 'private' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
