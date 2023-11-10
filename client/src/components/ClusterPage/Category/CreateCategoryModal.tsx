import { useState, useEffect, useContext, useRef } from 'react'
import { Form, Button, Input, Checkbox, Typography, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { clusterContext } from '../../../context'
import Title from 'antd/es/typography/Title'
import { CheckboxOptionType } from 'antd/lib'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import CreateNewField from './CreateNewField'

export default function CreateCategoryModal() {
    const [form] = useForm()

    const {
        nodesState: [nodes, setNodes],
        selectNode,
        relationNewNodeState: [relationNewNode, setRelationNewNode],
        isCreateCategoryModalVisibleState: [
            isCreateCategoryModalVisible,
            setIsCreateCategoryModalVisible,
        ],
        categoriesState: [categories, setCategories],
        fieldsForCategoryState: [fieldsForCategory, setFieldsForCategory],
    } = useContext(clusterContext)

    const [titleInput, setTitleInput] = useState('')
    const [isCreateFieldBtnVisible, setIsCreateFieldBtnVisible] = useState(true)
    const [isOnlyForThisCluster, setIsOnlyForThisCluster] =
        useState<boolean>(true)

    const [checkboxesValues, setCheckboxesValues] = useState<
        CheckboxValueType[]
    >([])

    useEffect(() => {
        if (fieldsForCategory.length >= 5) {
            setIsCreateFieldBtnVisible(false)
        } else {
            setIsCreateFieldBtnVisible(true)
        }
    }, [fieldsForCategory])

    const optionsForCategory: CheckboxOptionType[] = [
        { label: 'Color field', value: 'color' },
        { label: 'Image field', value: 'image' },
        { label: 'Source filed', value: 'source' },
        { label: 'Tags', value: 'tags' },
    ]

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTitleInput(event.target.value)
    }

    function createCategory() {
        const category = {
            title: titleInput,
            onlyForThisCluster: isOnlyForThisCluster,
            options: checkboxesValues,
            fields: fieldsForCategory,
        }
        setCategories([...categories, category])
        console.log('new category: ', category)
        setIsCreateCategoryModalVisible(false)
    }

    function onCancel() {
        setIsCreateCategoryModalVisible(false)
    }

    function handleChangeCheckboxes(checkedValues: CheckboxValueType[]) {
        setCheckboxesValues(checkedValues)
    }

    function handleChangeCheckbox(e: CheckboxChangeEvent) {
        setIsOnlyForThisCluster(e.target.checked)
    }

    function handleCreateNewField() {
        const id = Math.floor(Math.random() * 10000) + 1
        setFieldsForCategory((prev) => [
            ...prev,
            { id: id, label: '', type: '' },
        ])
    }

    const handleOk = () => {
        createCategory()
        setIsCreateCategoryModalVisible(false)
    }

    const handleCancel = () => {
        setIsCreateCategoryModalVisible(false)
    }

    return (
        <Modal
            open={isCreateCategoryModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Create"
            width={'400px'}
            centered
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Title level={3}>Create category</Title>
            </div>

            <div style={{ marginBottom: '5px' }}>
                <h4>Title</h4>
                <Input
                    placeholder="Enter category title please..."
                    value={titleInput}
                    onChange={onChange}
                />
            </div>

            <div style={{ marginBottom: '5px' }}>
                <Checkbox
                    checked={isOnlyForThisCluster}
                    onChange={handleChangeCheckbox}
                >
                    Only for this cluster
                </Checkbox>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <h4 style={{ marginBottom: '5px' }}>Fields</h4>
                <div>
                    {fieldsForCategory.map((item, index) => (
                        <CreateNewField key={index} fieldId={item.id} />
                    ))}
                </div>
                {isCreateFieldBtnVisible && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'end',
                            width: '100%',
                            minHeight: '40px',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            onClick={handleCreateNewField}
                            style={{ marginBottom: '5px' }}
                        >
                            Add filed
                        </Button>
                    </div>
                )}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <h4 style={{ marginBottom: '7px' }}>Options</h4>
                <Checkbox.Group
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: '5px',
                    }}
                    options={optionsForCategory}
                    onChange={handleChangeCheckboxes}
                />
            </div>
        </Modal>
    )
}
