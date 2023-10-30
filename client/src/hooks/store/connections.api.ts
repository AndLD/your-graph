import {
    useDeleteConnectionMutation,
    usePostConnectionMutation,
} from '../../store/connections.api'
import {
    IConnection,
    IConnectionPostBody,
} from '../../utils/interfaces/connections'

export function usePostConnection(
    clusterId: string,
    edgesState: [
        IConnection[],
        React.Dispatch<React.SetStateAction<IConnection[]>>
    ]
) {
    const [edges, setEdges] = edgesState
    const [postConnectionMutation] = usePostConnectionMutation()

    return (body: IConnectionPostBody) => {
        if (!clusterId) {
            return
        }
        postConnectionMutation({ clusterId, body })
            .then((value: any) => {
                if (value.data) {
                    const { _id, ...rest } = value.data

                    // Upon successful creation, add to edges state
                    setEdges([...edges, { id: _id, ...rest }])
                }
            })
            .catch((error) => {
                console.error('Failed to create connection:', error)
            })
    }
}

export function useDeleteConnection(
    clusterId: string,
    edgesState: [
        IConnection[],
        React.Dispatch<React.SetStateAction<IConnection[]>>
    ]
) {
    const [edges, setEdges] = edgesState

    const [deleteConnectionMutation] = useDeleteConnectionMutation()

    return (connectionId: string) => {
        if (!clusterId) {
            return
        }
        deleteConnectionMutation({
            connectionId,
            clusterId,
        })
            .then((value: any) => {
                setEdges(edges.filter(({ id }) => id !== connectionId))
            })
            .catch((error) => {
                console.error('Failed to delete connection:', error)
            })
    }
}
