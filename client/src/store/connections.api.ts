import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithRefresh } from '../utils/store'
import {
    IConnection,
    IConnectionPostBody,
} from '../utils/interfaces/connections'

export const connectionsApi = createApi({
    reducerPath: 'connections/api',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        postConnection: builder.mutation<
            IConnection,
            {
                clusterId: string
                body: IConnectionPostBody
            }
        >({
            query: ({ clusterId, body }) => ({
                method: 'POST',
                url: `/api/private/clusters/${clusterId}/connections`,
                body,
            }),
        }),
        deleteConnection: builder.mutation<
            IConnection,
            { connectionId: string; clusterId: string }
        >({
            query: ({ connectionId, clusterId }) => ({
                method: 'DELETE',
                url: `/api/private/clusters/${clusterId}/connections/${connectionId}`,
            }),
        }),
    }),
})

export const { usePostConnectionMutation, useDeleteConnectionMutation } =
    connectionsApi
