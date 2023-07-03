import { EditOutlined } from '@ant-design/icons'

interface IEditSourceBtnProps {
    id: string
    title: string
    link?: string | null
    setSourceEdit: React.Dispatch<React.SetStateAction<{ id: string; newTitle: string; title: string } | null>>
}

export default function EditSourceBtn({ id, title, link, setSourceEdit }: IEditSourceBtnProps) {
    return <EditOutlined onClick={() => setSourceEdit({ id, newTitle: `${title}${link ? `::${link}` : ''}`, title })} />
}
