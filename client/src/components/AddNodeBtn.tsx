import { Button } from 'antd'
import { randomInteger } from '../helpers/utils'
import { useContext } from 'react'
import { appContext } from '../context'

export default function AddNodeBtn() {
    const {
        nodesState: [nodes, setNodes]
    } = useContext(appContext)

    function addNode() {
        setNodes([
            ...nodes,
            {
                id: randomInteger(0, 20000)
            }
        ])
    }

    return (
        <div style={{ position: 'absolute', top: 50, right: 50, fontSize: 20 }}>
            <span style={{ marginRight: 15 }}>{nodes.length}</span>
            <Button type="primary" onClick={addNode}>
                Add node
            </Button>
        </div>
    )
}
