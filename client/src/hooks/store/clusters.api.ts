import React, { SetStateAction, useContext, useEffect } from 'react'
import {
    useDeleteClusterMutation,
    useFetchClusterQuery,
    useFetchClustersQuery,
    usePostClusterMutation,
    usePutClusterMutation,
} from '../../store/clusters.api'
import { ICluster, IClusterPutBody } from '../../utils/interfaces/clusters'
import { errorNotification } from '../../utils/notifications'
import { useToken } from '../auth'
import { clustersContext } from '../../context'
import { useParams } from 'react-router-dom'
import { INode } from '../../utils/interfaces/nodes'
import { IConnection } from '../../utils/interfaces/connections'
import { ISource } from '../../utils/interfaces/sources'
import dayjs from 'dayjs'

export function useFetchClusters(
    setClusters: React.Dispatch<SetStateAction<ICluster[]>>
) {
    const token = useToken()

    const fetchClustersQuery = useFetchClustersQuery(undefined, {
        skip: !token,
    })

    useEffect(() => {
        if (fetchClustersQuery.data) {
            setClusters(fetchClustersQuery.data)
        }
    }, [fetchClustersQuery.data])
}

export function useFetchCluster(
    setCluster: React.Dispatch<SetStateAction<ICluster | null>>,
    setNodes: React.Dispatch<SetStateAction<INode[]>>,
    setEdges: React.Dispatch<SetStateAction<IConnection[]>>,
    setSources: React.Dispatch<SetStateAction<ISource[]>>
) {
    const token = useToken()

    const id = useParams().id

    const fetchClusterQuery = id
        ? useFetchClusterQuery({ id }, { skip: !token })
        : null

    useEffect(() => {
        if (fetchClusterQuery && fetchClusterQuery.data) {
            setCluster(fetchClusterQuery.data.cluster)
            setNodes(
                fetchClusterQuery.data.nodes.map(({ _id, ...node }) => {
                    const modified: INode = {
                        id: _id,
                        ...node,
                    }

                    if (node.image) {
                        modified.image = `/images/${_id}${node.image}`
                    }
                    if (node.startDate) {
                        modified.startDate = dayjs(node.startDate, 'DD.MM.YYYY')
                    }
                    if (node.endDate) {
                        modified.endDate = dayjs(node.endDate, 'DD.MM.YYYY')
                    }

                    return modified
                })
            )
            setEdges(
                fetchClusterQuery.data.connections.map(({ _id, ...rest }) => ({
                    id: _id,
                    ...rest,
                }))
            )
            setSources(
                fetchClusterQuery.data.sources.map(({ _id, ...rest }) => ({
                    id: _id,
                    ...rest,
                }))
            )
        }
    }, [fetchClusterQuery?.data])
}

export function usePostCluster(callback: (newClusterId: string) => void) {
    const [clusters, setClusters] = useContext(clustersContext).clustersState

    const [postClusterMutation] = usePostClusterMutation()

    return (title: string) => {
        postClusterMutation({
            body: {
                title,
            },
        }).then((value: any) => {
            if (value.data) {
                const cluster = value?.data
                setClusters([...clusters, cluster])

                callback(cluster.id)
            } else {
                const error = value.error?.msg || value.error?.data?.error
                errorNotification(error, 'Додати роль не вдалося')
            }
        })
    }
}

export function useDeleteCluster() {
    const {
        clustersState: [clusters, setClusters],
    } = useContext(clustersContext)

    const [deleteClusterMutation] = useDeleteClusterMutation()

    return (id: string) => {
        deleteClusterMutation({
            id,
        }).then((value: any) => {
            if (value.data) {
                const newClusters = [
                    ...clusters.filter((cluster) => !(cluster._id === id)),
                ]

                setClusters(newClusters)
            } else {
                const error = value.error?.msg || value.error?.data?.error
                errorNotification(error, 'Видалити роль не вдалося')
            }
        })
    }
}

export function usePutCluster(callback: () => void) {
    const [clusters, setClusters] = useContext(clustersContext).clustersState

    const [putClusterMutation] = usePutClusterMutation()

    return (id: string, body: IClusterPutBody) => {
        putClusterMutation({
            id,
            body,
        }).then((value: any) => {
            if (value.data) {
                const newCluster = value.data
                setClusters(
                    clusters.map((cluster) => {
                        if (cluster._id === id) {
                            return newCluster
                        }

                        return cluster
                    })
                )

                callback()
            } else {
                const error = value.error?.msg || value.error?.data?.error
                errorNotification(error, 'Оновлення ролі не вдалося')
            }
        })
    }
}
