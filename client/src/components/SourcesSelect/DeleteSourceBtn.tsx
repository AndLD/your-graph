import { DeleteOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import { useDeleteSource } from '../../hooks/sources'

interface IDeleteSourceBtnProps {
    id: string
    callback: () => void
}

export default function DeleteSourceBtn({ id, callback }: IDeleteSourceBtnProps) {
    const deleteSource = useDeleteSource()

    return (
        <Popconfirm
            title="Ви дійсно бажаєте видалити роль?"
            okText="Так"
            cancelText="Ні"
            onConfirm={() => {
                deleteSource(id)
                callback()
            }}
        >
            <DeleteOutlined style={{ marginLeft: 10 }} />
        </Popconfirm>
    )
}
