import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithRefresh } from '../utils/store'
import {
    ISource,
    ISourcePostBody,
    ISourcePutBody,
} from '../utils/interfaces/sources'

export const sourcesApi = createApi({
    reducerPath: 'sources/api',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        postSource: builder.mutation<
            ISource,
            { clusterId: string; body: ISourcePostBody }
        >({
            query: ({ clusterId, body }) => ({
                method: 'POST',
                url: `/api/private/clusters/${clusterId}/sources`,
                body,
            }),
        }),
        putSource: builder.mutation<
            ISource,
            { clusterId: string; id: string; body: ISourcePutBody }
        >({
            query: ({ clusterId, id, body }) => ({
                method: 'PUT',
                url: `/api/private/clusters/${clusterId}/sources/${id}`,
                body,
            }),
        }),
        deleteSource: builder.mutation<
            ISource,
            { clusterId: string; id: string }
        >({
            query: ({ clusterId, id }) => ({
                method: 'DELETE',
                url: `/api/private/clusters/${clusterId}/sources/${id}`,
            }),
        }),
    }),
})

export const {
    usePostSourceMutation,
    usePutSourceMutation,
    useDeleteSourceMutation,
} = sourcesApi
