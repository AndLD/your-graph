import React, { SetStateAction, useContext, useEffect } from 'react'
import {
    useDeleteClusterMutation,
    useFetchClusterQuery,
    useFetchClustersQuery,
    usePostClusterMutation,
    usePutClusterMutation,
} from '../../store/clusters.api'
import {
    ICluster,
    IClusterPutBody,
    IFetchClusterResponse,
} from '../../utils/interfaces/clusters'
import { errorNotification } from '../../utils/notifications'
import { useToken } from '../auth'
import { clustersContext } from '../../context'
import { useParams } from 'react-router-dom'

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
    callback?: (data: IFetchClusterResponse) => void
) {
    const token = useToken()

    const id = useParams().id

    const fetchClusterQuery = id
        ? useFetchClusterQuery({ id }, { skip: !token })
        : null

    useEffect(() => {
        if (fetchClusterQuery && fetchClusterQuery.data && callback) {
            callback(fetchClusterQuery.data)
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
                errorNotification(error, 'Post cluster request failed')
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
                errorNotification(error, 'Delete cluster request failed')
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
                errorNotification(error, 'Put cluster request failed')
            }
        })
    }
}
