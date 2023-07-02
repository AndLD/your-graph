import { Progress } from 'antd'
import { useContext } from 'react'
import { appContext } from '../context'

// TODO: implement
// function getBorder(currentValue: number) {
//     return Math.round(currentValue / 500)
// }

export default function MyProgress() {
    const {
        nodesState: [nodes, setNodes]
    } = useContext(appContext)

    return (
        <div style={{ marginTop: 10 }}>
            <Progress
                type="circle"
                size="small"
                percent={(100 * nodes.length) / 500}
                format={(percent) => nodes.length}
            />
        </div>
    )
}
