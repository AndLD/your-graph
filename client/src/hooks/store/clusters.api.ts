import React, { SetStateAction, useContext, useEffect } from 'react'
import {
    useDeleteClusterMutation,
    useFetchClustersQuery,
    usePostClusterMutation,
    usePutClusterMutation,
} from '../../store/clusters.api'
import { ICluster, IClusterPutBody } from '../../utils/interfaces/clusters'
import { errorNotification } from '../../utils/notifications'
import { useToken } from '../auth'
import { clustersContext } from '../../context'

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
