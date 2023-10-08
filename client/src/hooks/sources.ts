import { useContext } from 'react'
import { clusterContext } from '../context'
import axios from 'axios'
import { ISource } from '../utils/interfaces/sources'

export function usePostSource(callback: (newSourceId: string) => void) {
    const clusterId = useContext(clusterContext).clusterId
    const [sources, setSources] = useContext(clusterContext).sourcesState

    return (title: string, link: string | null) => {
        axios
            .post(`/api/private/clusters/${clusterId}/sources`, {
                title,
                link,
            })
            .then((response: any) => {
                const source = response.data
                setSources([...sources, source])

                callback(source.id)
            })
    }
}

export function useDeleteSource() {
    const clusterId = useContext(clusterContext).clusterId
    const [sources, setSources] = useContext(clusterContext).sourcesState

    return (id: string) => {
        axios
            .delete(`/api/private/clusters/${clusterId}/sources/${id}`)
            .then(() => {
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

    return (id: string, body: ISource) => {
        axios
            .put(`/api/private/clusters/${clusterId}/sources/${id}`, body)
            .then((response: any) => {
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
