import { clusterContext } from '../../context'
import SelectCategoryModal from './SelectCategoryModal'
import { useContext } from 'react'

export default function SelectCategoryModalWrapper() {
    const {
        isSelectCategoryModalVisibleState: [
            isSelectCategoryModalVisible,
            setIsSelectCategoryModalVisible,
        ],
    } = useContext(clusterContext)

    return isSelectCategoryModalVisible ? <SelectCategoryModal /> : null
}
