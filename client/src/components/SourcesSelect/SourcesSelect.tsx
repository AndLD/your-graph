import { Divider, FormInstance, Select } from 'antd'
import { useContext, useEffect, useState } from 'react'
import EditSourceInput from './EditSourceInput'
import NewSourceInput from './NewSourceInput'
import Source from './Source'
import { appContext } from '../../context'
import { ID, ISource } from '../../helpers/interfaces'
import { WarningOutlined } from '@ant-design/icons'

interface ISourcesStateProps {
    form: FormInstance<any>
    value?: any
    onChange?: (value: any) => void
    required?: boolean
}

export default function SourcesSelect({ form, value, onChange, required }: ISourcesStateProps) {
    const [sources, setSources] = useContext(appContext).sourcesState
    const [newSourceTitle, setNewSourceTitle] = useState('')
    const [sourceEdit, setSourceEdit] = useState<{ id: string; newTitle: string; title: string } | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isSourceControlsHover, setIsSourceControlsHover] = useState(false)
    const [options, setOptions] = useState<
        | (
              | {
                    value: string
                    label: JSX.Element
                }
              | {
                    value: null
                    label: JSX.Element
                }
          )[]
        | []
    >([])

    const dropdownRender = (menu: React.ReactNode) => (
        <div>
            {menu}
            <Divider style={{ margin: 0 }} />
            <div style={{ padding: 8 }}>
                {sourceEdit ? (
                    <EditSourceInput sourceEditState={[sourceEdit, setSourceEdit]} />
                ) : (
                    <NewSourceInput form={form} newSourceTitleState={[newSourceTitle, setNewSourceTitle]} />
                )}
            </div>
        </div>
    )

    useEffect(() => {
        setOptions(
            sources.map((source: ISource) => ({
                value: source.id as ID,
                label: (
                    <Source
                        id={source.id as ID}
                        title={source.title}
                        link={source.link}
                        isSelectOpenState={[isOpen, setIsOpen]}
                        setIsSourceControlsHover={setIsSourceControlsHover}
                        selectedSources={value}
                        setSourceEdit={setSourceEdit}
                        form={form}
                    />
                )
            }))
        )
    }, [sources, isSourceControlsHover, isOpen, sourceEdit])

    return (
        <Select
            mode="multiple"
            options={options}
            onDropdownVisibleChange={(open) => {
                setNewSourceTitle('')
                if (!isSourceControlsHover) {
                    setIsOpen(open)
                }
            }}
            open={isOpen}
            value={value}
            onChange={(value) => {
                if (!isSourceControlsHover && onChange) {
                    onChange(value)
                }
            }}
            dropdownRender={dropdownRender}
            placeholder="Source"
        />
    )
}
