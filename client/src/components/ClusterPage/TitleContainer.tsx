import { useContext, useEffect, useState } from 'react'
import { clusterContext } from '../../context'
import { Utils } from '../../utils/utils'
import { INode } from '../../utils/interfaces/nodes'

export default function TitleContainer() {
    const {
        nodesState: [nodes, setNodes],
        hoveredNodeIdState: [hoveredNodeId, setHoveredNodeId],
    } = useContext(clusterContext)

    const [hoveredNode, setHoveredNode] = useState<INode | null>(null)

    useEffect(() => {
        if (hoveredNodeId) {
            setHoveredNode(nodes.find(({ id }) => hoveredNodeId === id) as any)
        } else {
            setHoveredNode(null)
        }
    }, [hoveredNodeId])

    return hoveredNode?.label ? (
        <div className="title-container">{hoveredNode.label}</div>
    ) : null
}
