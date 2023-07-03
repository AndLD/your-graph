import { AutoComplete, Input, Tag } from 'antd'
import { DefaultOptionType } from 'antd/es/cascader'
import { BaseOptionType } from 'antd/es/select'
import { useContext, useEffect, useState } from 'react'
import { appContext } from '../context'
import { ID } from '../helpers/interfaces'

interface IApplicableKey {
    id: ID
    title?: string
    tags?: string[]
    keys: string[]
}

export default function SearchContainer() {
    const {
        nodesState: [nodes, setNodes],
        selectNode,
        selectedNodeIdState: [selectedNodeId],
        updateConnection
    } = useContext(appContext)

    const [applicableKeys, setApplicableKeys] = useState<IApplicableKey[]>([])

    const [value, setValue] = useState<string>('')
    const [options, setOptions] = useState<(BaseOptionType | DefaultOptionType)[]>([])

    useEffect(() => {
        setApplicableKeys(
            nodes.map((node) => ({
                id: node.id,
                title: node.title,
                tags: node.tags,
                keys: [
                    ...(node.title ? [...node.title.toLowerCase().split(' ')] : []),
                    ...(node.tags?.map((tag) => tag.toLowerCase()) || [])
                ]
            }))
        )
    }, [nodes])

    function getPanelValue(text: string): (BaseOptionType | DefaultOptionType)[] {
        return applicableKeys
            .filter((node) => {
                if (node.title?.includes(text)) {
                    return true
                }

                for (const key of node.keys) {
                    if (key.includes(text)) {
                        return true
                    }
                }

                return false
            })
            .map((node) => ({
                label: (
                    <>
                        <div>{node.title || '...'}</div>
                        <div>
                            {node.tags?.map((tag, i) => (
                                <Tag key={`tag${i}`}>{tag}</Tag>
                            ))}
                        </div>
                    </>
                ),
                value: node.id
            }))
    }

    return (
        <div className="search-container">
            <AutoComplete
                style={{ width: '30vw' }}
                options={options}
                value={value}
                onChange={setValue}
                onSearch={(text) => setOptions(getPanelValue(text.toLowerCase()))}
                onSelect={(id: string) => {
                    setValue('')
                    if (selectedNodeId) {
                        updateConnection(id)
                    } else {
                        selectNode(id, true)
                    }
                }}
            >
                <Input.Search size="large" placeholder="Search box" />
            </AutoComplete>
        </div>
    )
}
