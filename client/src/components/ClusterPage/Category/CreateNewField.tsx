import { Button, Input, Select } from 'antd'
import { useContext } from 'react'
import { clusterContext } from '../../../context'

const options = [
    { value: 'Text', label: 'Text' },
    { value: 'Date', label: 'Date' },
]

export default function CreateNewField({ index }: { index: number }) {
    const {
        fieldsForCategoryState: [fieldsForCategory, setFieldsForCategory],
    } = useContext(clusterContext)

    const findFieldIndex = () => {
        return fieldsForCategory.findIndex((_, i) => i === index)
    }

    function handleDeleteField() {
        const newFields = fieldsForCategory.filter((_, i) => i !== index)
        setFieldsForCategory(newFields)
    }

    function handleChangeSelect(value: string) {
        const fieldIndex = findFieldIndex()
        if (fieldIndex !== -1) {
            const updatedField = {
                ...fieldsForCategory[fieldIndex],
                type: value,
            }
            const newFields = [...fieldsForCategory]
            newFields[fieldIndex] = updatedField
            setFieldsForCategory(newFields)
        }
    }

    function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
        const fieldIndex = findFieldIndex()
        if (fieldIndex !== -1) {
            const updatedField = {
                ...fieldsForCategory[fieldIndex],
                label: e.target.value,
            }
            const newFields = [...fieldsForCategory]
            newFields[fieldIndex] = updatedField
            setFieldsForCategory(newFields)
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <Input
                onChange={handleChangeInput}
                placeholder="Label"
                style={{ marginBottom: '5px', marginRight: '3px' }}
            />
            <Select
                onChange={handleChangeSelect}
                options={options}
                placeholder="type"
                style={{ width: '90px', marginRight: '3px' }}
            />
            <Button onClick={handleDeleteField}>X</Button>
        </div>
    )
}
