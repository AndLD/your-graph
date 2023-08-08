import { Divider, Input } from 'antd'
import { CloseOutlined, EditOutlined } from '@ant-design/icons'
import { useMessages } from '../../../helpers/messages'
import { usePutSource } from '../../../hooks/sources'
import { LINE_SPLITTER } from '../../../helpers/constants'

interface IEditSourceInputProps {
    sourceEditState: [
        { id: string; newTitle: string; title: string } | null,
        React.Dispatch<React.SetStateAction<{ id: string; newTitle: string; title: string } | null>>
    ]
}

export default function EditSourceInput({ sourceEditState }: IEditSourceInputProps) {
    const [sourceEdit, setSourceEdit] = sourceEditState

    const { errorMessage, contextHolder } = useMessages()

    const putSource = usePutSource(() => setSourceEdit(null))

    if (!sourceEdit) {
        return null
    }

    return (
        <Input
            value={sourceEdit.newTitle}
            onChange={(e) => setSourceEdit({ ...sourceEdit, newTitle: e.target.value })}
            addonAfter={
                <>
                    {contextHolder}
                    <EditOutlined
                        onClick={() => {
                            if (sourceEdit.newTitle !== sourceEdit.title) {
                                const [title, link] = sourceEdit.newTitle.split(LINE_SPLITTER)
                                putSource(sourceEdit.id, { title, link: link || null })
                            } else {
                                errorMessage('Field is not edited')
                            }
                        }}
                    />
                    <Divider type={'vertical'} style={{ padding: 0 }} />
                    <CloseOutlined
                        onClick={() => {
                            setSourceEdit(null)
                        }}
                    />
                </>
            }
        />
    )
}
