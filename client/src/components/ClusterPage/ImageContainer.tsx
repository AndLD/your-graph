import { useContext, useEffect, useState } from 'react'
import { clusterContext } from '../../context'
import { INode } from '../../helpers/interfaces'

export default function ImageContainer() {
    const {
        nodesState: [nodes, setNodes],
        hoveredNodeIdState: [hoveredNodeId, setHoveredNodeId]
    } = useContext(clusterContext)

    const [hoveredNode, setHoveredNode] = useState<INode | null>(null)

    useEffect(() => {
        if (hoveredNodeId) {
            setHoveredNode(nodes.find(({ id }) => hoveredNodeId === id) as any)
        } else {
            setHoveredNode(null)
        }
    }, [hoveredNodeId])

    return hoveredNode?.image ? (
        <div className="image-container">
            <img src={hoveredNode.image} />
        </div>
    ) : null
}
