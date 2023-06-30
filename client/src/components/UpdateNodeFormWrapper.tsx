import { appContext } from '../context'
import UpdateNodeForm from './UpdateNodeForm'
import { useContext, useState, useEffect } from 'react'
export default function UpdateNodeFormWrapper() {
    const {
        nodesState: [nodes, setNodes],
        selectedNodeIdState: [selectedNodeId, setSelectedNodeId]
    } = useContext(appContext)

    return selectedNodeId ? <UpdateNodeForm /> : null
}
