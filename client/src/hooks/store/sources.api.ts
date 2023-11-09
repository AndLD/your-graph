import { useContext } from 'react'
import { clusterContext } from '../../context'
import axios from 'axios'
import {
    ISource,
    ISourcePostBody,
    ISourcePutBody,
} from '../../utils/interfaces/sources'
import {
    useDeleteSourceMutation,
    usePostSourceMutation,
    usePutSourceMutation,
} from '../../store/sources.api'

export function usePostSource(callback: (newSourceId: string) => void) {
    const clusterId = useContext(clusterContext).clusterId
    const [sources, setSources] = useContext(clusterContext).sourcesState

    const [postSourceMutation] = usePostSourceMutation()

    return (title: string, link: string | null) => {
        if (!clusterId) {
            return
        }
        postSourceMutation({
            clusterId,
            body: {
                title,
                link,
                clusterId,
            },
        }).then((response: any) => {
            const source = response.data
            setSources([...sources, source])

            callback(source.id)
        })
    }
}

export function useDeleteSource() {
    const clusterId = useContext(clusterContext).clusterId
    const [sources, setSources] = useContext(clusterContext).sourcesState

    const [deleteSourceMutation] = useDeleteSourceMutation()

    return (id: string) => {
        if (!clusterId) {
            return
        }

        deleteSourceMutation({
            clusterId,
            id,
        }).then(() => {
            const newSources = [
                ...sources.filter((source) => !(source.id === id)),
            ]

            setSources(newSources)
        })
    }
}

export function usePutSource(callback: () => void) {
    const clusterId = useContext(clusterContext).clusterId
    const [sources, setSources] = useContext(clusterContext).sourcesState

    const [putSourceMutation] = usePutSourceMutation()

    return (id: string, body: ISourcePutBody) => {
        if (!clusterId) {
            return
        }
        putSourceMutation({
            clusterId,
            id,
            body,
        }).then((response: any) => {
            const newSource = response.data

            setSources(
                sources.map((source) => {
                    if (source.id === id) {
                        return newSource
                    }

                    return source
                })
            )

            callback()
        })
    }
}
