import { PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd'
import { usePostSource } from '../../../hooks/store/sources.api'
import { LINE_SPLITTER } from '../../../utils/constants'
import { useMessages } from '../../../utils/messages'

interface IAddSourceBtnProps {
    form: FormInstance<any>
    newSourceTitleState: [string, React.Dispatch<React.SetStateAction<string>>]
}

export default function AddSourceBtn({
    form,
    newSourceTitleState: [newSourceTitle, setNewSourceTitle],
}: IAddSourceBtnProps) {
    const { errorMessage, contextHolder } = useMessages()

    const postSource = usePostSource((newSourceId: string) => {
        console.log('SourceId: ', form.getFieldValue('sourceId'))
        setNewSourceTitle('')
        form.setFieldValue('sourceIds', [
            ...form.getFieldValue('sourceIds'),
            newSourceId,
        ])
    })

    return (
        <>
            {contextHolder}
            <PlusOutlined
                onClick={() => {
                    if (!newSourceTitle) return

                    const [title, link] = newSourceTitle.split(LINE_SPLITTER)

                    if (title && link) {
                        postSource(title, link)
                    } else if (title) {
                        postSource(title, null)
                    } else {
                        errorMessage('Invalid line')
                    }
                }}
            />
        </>
    )
}
