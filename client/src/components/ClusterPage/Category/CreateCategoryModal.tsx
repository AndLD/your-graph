import { useState, useEffect, useContext } from 'react'
import { Button, Input, Checkbox, Modal } from 'antd'
import { clusterContext } from '../../../context'
import Title from 'antd/es/typography/Title'
import { CheckboxOptionType } from 'antd/lib'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import CreateNewField from './CreateNewField'
import { usePostCategory } from '../../../hooks/store/caregories.api'
export default function CreateCategoryModal() {
    const {
        isCreateCategoryModalVisibleState: [
            isCreateCategoryModalVisible,
            setIsCreateCategoryModalVisible,
        ],
        categoriesState: [categories, setCategories],
        fieldsForCategoryState: [fieldsForCategory, setFieldsForCategory],
        clusterId,
    } = useContext(clusterContext)

    const [titleInput, setTitleInput] = useState('')
    const [isCreateFieldBtnVisible, setIsCreateFieldBtnVisible] = useState(true)
    const [isOnlyForThisCluster, setIsOnlyForThisCluster] =
        useState<boolean>(true)

    const [checkboxesValues, setCheckboxesValues] = useState<
        CheckboxValueType[]
    >([])

    const postCategory = usePostCategory()

    useEffect(() => {
        if (fieldsForCategory.length >= 5) {
            setIsCreateFieldBtnVisible(false)
        } else {
            setIsCreateFieldBtnVisible(true)
        }
    }, [fieldsForCategory])

    const optionsForCategory: CheckboxOptionType[] = [
        { label: 'Color', value: 'color' },
        { label: 'Start Date', value: 'startDate' },
        { label: 'End Date', value: 'endDate' },
        { label: 'Tags', value: 'tags' },
        { label: 'Image', value: 'image' },
        { label: 'Source', value: 'source' },
    ]

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTitleInput(event.target.value)
    }

    function createCategory() {
        if (clusterId) {
            const category = {
                title: titleInput,
                clusterId: isOnlyForThisCluster ? clusterId : null,
                options: checkboxesValues,
                fields: fieldsForCategory,
            }
            postCategory(category)
        }
        setIsCreateCategoryModalVisible(false)
    }

    function handleChangeCheckboxes(checkedValues: CheckboxValueType[]) {
        setCheckboxesValues(checkedValues)
    }

    function handleChangeCheckbox(e: CheckboxChangeEvent) {
        setIsOnlyForThisCluster(e.target.checked)
    }

    function handleCreateNewField() {
        setFieldsForCategory((prev) => [...prev, { label: '', type: '' }])
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
            zIndex={10}
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
                    {fieldsForCategory.map((_, index) => (
                        <CreateNewField key={index} index={index} />
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
                            Add one
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
