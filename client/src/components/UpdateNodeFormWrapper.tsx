import { appContext } from '../context'
import UpdateNodeForm from './UpdateNodeForm'
import { useContext } from 'react'
export default function UpdateNodeFormWrapper() {
    const {
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId]
    } = useContext(appContext)

    return selectedNodeId ? <UpdateNodeForm /> : null
}
