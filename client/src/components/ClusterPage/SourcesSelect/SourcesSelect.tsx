import { Divider, FormInstance, Select } from 'antd'
import { useContext, useEffect, useState } from 'react'
import EditSourceInput from './EditSourceInput'
import NewSourceInput from './NewSourceInput'
import Source from './Source'
import { clusterContext } from '../../../context'
import { ID } from '../../../utils/types'
import { ISource } from '../../../utils/interfaces/sources'

interface ISourcesStateProps {
    form: FormInstance<any>
    value?: any
    onChange?: (value: any) => void
    required?: boolean
}

export default function SourcesSelect({
    form,
    value,
    onChange,
    required,
}: ISourcesStateProps) {
    const [sources, setSources] = useContext(clusterContext).sourcesState
    const [newSourceTitle, setNewSourceTitle] = useState('')
    const [sourceEdit, setSourceEdit] = useState<{
        id: string
        newTitle: string
        title: string
    } | null>(null)
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
                    <EditSourceInput
                        sourceEditState={[sourceEdit, setSourceEdit]}
                    />
                ) : (
                    <NewSourceInput
                        form={form}
                        newSourceTitleState={[
                            newSourceTitle,
                            setNewSourceTitle,
                        ]}
                    />
                )}
            </div>
        </div>
    )

    useEffect(() => {
        setOptions(
            sources.map((source: ISource) => {
                return {
                    value: source.id as ID,
                    label: (
                        <Source
                            key={source.id}
                            id={source.id as ID}
                            title={source.title}
                            link={source.link}
                            isSelectOpenState={[isOpen, setIsOpen]}
                            setIsSourceControlsHover={setIsSourceControlsHover}
                            selectedSources={value}
                            setSourceEdit={setSourceEdit}
                            form={form}
                        />
                    ),
                }
            })
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
