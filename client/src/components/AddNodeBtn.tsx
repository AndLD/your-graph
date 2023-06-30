import { Button, Progress } from 'antd'
import { useContext } from 'react'
import { appContext } from '../context'
import axios from 'axios'
import { useMessages } from '../helpers/messages'

// TODO: implement
// function getBorder(currentValue: number) {
//     return Math.round(currentValue / 500)
// }

export default function AddNodeBtn() {
    const {
        nodesState: [nodes, setNodes]
    } = useContext(appContext)

    const { successMessage, errorMessage, contextHolder } = useMessages()

    function addNode() {
        // Make a POST request to add an empty node
        axios
            .post('http://localhost:8080/api/nodes', {})
            .then((response) => {
                successMessage()
                const { _id, ...rest } = response.data

                // Update the nodesState by adding the new node
                setNodes([...nodes, { id: _id, ...rest }])
            })
            .catch((error) => {
                errorMessage('Failed to add node:' + error)
                console.error('Failed to add node:', error)
            })
    }

    return (
        <div style={{ position: 'absolute', top: 50, right: 50, fontSize: 20 }}>
            {contextHolder}

            <div>
                <Button type="primary" onClick={addNode}>
                    Add node
                </Button>
            </div>
            <div style={{ margin: 20 }}>
                <Progress
                    type="circle"
                    size="small"
                    percent={(100 * nodes.length) / 500}
                    format={(percent) => nodes.length}
                />
            </div>
        </div>
    )
}
