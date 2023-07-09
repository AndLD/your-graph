import { appContext } from '../context'
import UpdateNodeForm from './UpdateNodeForm'
import { useContext } from 'react'
export default function UpdateNodeFormWrapper() {
    const {
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        isUpdateNodeFormVisibleState: [isUpdateNodeFormVisible, setIsUpdateNodeFormVisible]
    } = useContext(appContext)

    return selectedNodeId && isUpdateNodeFormVisible ? <UpdateNodeForm /> : null
}
