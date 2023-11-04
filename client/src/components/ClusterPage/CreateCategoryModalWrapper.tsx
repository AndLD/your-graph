import { clusterContext } from '../../context'
import SelectCategoryModal from './SelectCategoryModal'
import { useContext } from 'react'
import CreateCategoryModal from './CreateCategoryModal'

export default function CreateCategoryModalWrapper() {
    const {
        isCreateCategoryModalVisibleState: [
            isCreateCategoryModalVisible,
            setIsCreateCategoryModalVisible,
        ],
    } = useContext(clusterContext)

    return isCreateCategoryModalVisible ? <CreateCategoryModal /> : null
}
