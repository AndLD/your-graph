import { FormInstance, Tooltip } from 'antd'
import { useState } from 'react'
import SourceControls from './SourceControls'

interface ISourceProps {
    id: string
    title: string
    link?: string | null
    selectedSources: string[]
    isSelectOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    setIsSourceControlsHover: React.Dispatch<React.SetStateAction<boolean>>
    setSourceEdit: React.Dispatch<React.SetStateAction<{ id: string; newTitle: string; title: string } | null>>
    form: FormInstance<any>
}

export default function Source({
    id,
    title,
    link,
    selectedSources,
    isSelectOpenState,
    setIsSourceControlsHover,
    setSourceEdit,
    form
}: ISourceProps) {
    const [isHover, setIsHover] = useState(false)

    const [isSelectOpen, setIsSelectOpen] = isSelectOpenState

    const shortTitle = title.length > 25 ? title.slice(0, 25) + '...' : title

    return (
        <div
            style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '100%' }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Tooltip title={title}>
                {link ? (
                    <a href={link} target="_blank" onClick={(e) => e.stopPropagation()}>
                        {shortTitle}
                    </a>
                ) : (
                    shortTitle
                )}
            </Tooltip>
            {isHover && isSelectOpen && (
                <SourceControls
                    id={id}
                    title={title}
                    link={link}
                    selectedSources={selectedSources}
                    form={form}
                    setIsOpenSelect={setIsSelectOpen}
                    setIsSourceControlsHover={setIsSourceControlsHover}
                    setSourceEdit={setSourceEdit}
                />
            )}
        </div>
    )
}
