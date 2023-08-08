import { clusterContext } from '../../context'
import UpdateNodeForm from './UpdateNodeForm'
import { useContext } from 'react'
export default function UpdateNodeFormWrapper() {
    const {
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId],
        isUpdateNodeFormVisibleState: [isUpdateNodeFormVisible, setIsUpdateNodeFormVisible]
    } = useContext(clusterContext)

    return selectedNodeId && isUpdateNodeFormVisible ? <UpdateNodeForm /> : null
}
