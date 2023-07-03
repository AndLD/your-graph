import { useContext } from 'react'
import { appContext } from '../context'
import { ISource } from '../helpers/interfaces'
import axios from 'axios'

export function usePostSource(callback: (newSourceId: string) => void) {
    const [sources, setSources] = useContext(appContext).sourcesState

    return (title: string, link: string | null) => {
        axios
            .post('/api/sources', {
                title,
                link
            })
            .then((response: any) => {
                const source = response.data
                setSources([...sources, source])

                callback(source.id)
            })
    }
}

export function useDeleteSource() {
    const {
        sourcesState: [sources, setSources]
    } = useContext(appContext)

    return (id: string) => {
        axios.delete(`/api/sources/${id}`).then(() => {
            const newSources = [...sources.filter((source) => !(source.id === id))]

            setSources(newSources)
        })
    }
}

export function usePutSource(callback: () => void) {
    const [sources, setSources] = useContext(appContext).sourcesState

    return (id: string, body: ISource) => {
        axios.put(`/api/sources/${id}`, body).then((response: any) => {
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
