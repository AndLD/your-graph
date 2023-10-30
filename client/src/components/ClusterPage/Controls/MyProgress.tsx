import { Progress, Tooltip } from 'antd'
import { useContext } from 'react'
import { clusterContext } from '../../../context'

function calculateUpBorder(value: number) {
    const base = 500
    const multiplier = Math.floor(value / base)

    if (value % base === 0) {
        return base * (multiplier * 3)
    } else {
        return base * (multiplier + 1)
    }
}

export default function MyProgress() {
    const {
        nodesState: [nodes, setNodes],
    } = useContext(clusterContext)

    const upBorder = calculateUpBorder(nodes.length)

    return (
        <div style={{ marginTop: 10 }}>
            <Tooltip placement="left" title={upBorder}>
                <Progress
                    style={{ background: 'white', borderRadius: '50%' }}
                    type="circle"
                    size="small"
                    percent={(100 * nodes.length) / upBorder}
                    format={(percent) => nodes.length}
                />
            </Tooltip>
        </div>
    )
}
