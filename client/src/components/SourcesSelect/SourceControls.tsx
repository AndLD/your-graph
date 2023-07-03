import { FormInstance } from 'antd'
import { useContext } from 'react'
import DeleteSourceBtn from './DeleteSourceBtn'
import EditSourceBtn from './EditSourceBtn'
import { appContext } from '../../context'

interface ISourceControlsProps {
    id: string
    title: string
    link?: string | null
    selectedSource: string
    form: FormInstance<any>
    setIsOpenSelect: React.Dispatch<React.SetStateAction<boolean>>
    setIsSourceControlsHover: React.Dispatch<React.SetStateAction<boolean>>
    setSourceEdit: React.Dispatch<React.SetStateAction<{ id: string; newTitle: string; title: string } | null>>
}

export default function SourceControls({
    id,
    title,
    link,
    selectedSource,
    form,
    setIsOpenSelect,
    setIsSourceControlsHover,
    setSourceEdit
}: ISourceControlsProps) {
    const {
        sourcesState: [sources, setSources]
    } = useContext(appContext)

    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={() => setIsOpenSelect(true)}
            onMouseEnter={() => setIsSourceControlsHover(true)}
            onMouseLeave={() => setIsSourceControlsHover(false)}
        >
            <EditSourceBtn id={id} title={title} link={link} setSourceEdit={setSourceEdit} />
            <DeleteSourceBtn
                id={id}
                callback={() => {
                    setIsSourceControlsHover(false)
                    if (id === selectedSource) {
                        form.setFieldValue('sourceId', sources.length ? sources[0].id : undefined)
                    }
                }}
            />
        </div>
    )
}
