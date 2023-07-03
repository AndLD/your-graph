import { PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd'
import { usePostSource } from '../../hooks/sources'
import { LINE_SPLITTER } from '../../helpers/constants'
import { useMessages } from '../../helpers/messages'

interface IAddSourceBtnProps {
    form: FormInstance<any>
    newSourceTitleState: [string, React.Dispatch<React.SetStateAction<string>>]
}

export default function AddSourceBtn({
    form,
    newSourceTitleState: [newSourceTitle, setNewSourceTitle]
}: IAddSourceBtnProps) {
    const { errorMessage, contextHolder } = useMessages()

    const postSource = usePostSource((newSourceId: string) => {
        setNewSourceTitle('')
        form.setFieldValue('sourceId', newSourceId)
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
