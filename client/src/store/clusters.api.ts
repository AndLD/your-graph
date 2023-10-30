import { createApi } from '@reduxjs/toolkit/query/react'
import {
    IClusterDeleteResponse,
    IClusterPostBody,
    IClusterPutBody,
    ICluster,
    IFetchClusterResponse,
} from '../utils/interfaces/clusters'
import { baseQueryWithRefresh } from '../utils/store'

export const clustersApi = createApi({
    reducerPath: 'clusters/api',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        postCluster: builder.mutation<ICluster, { body: IClusterPostBody }>({
            query: ({ body }) => ({
                method: 'POST',
                url: '/api/private/clusters',
                body,
            }),
        }),
        fetchClusters: builder.query<ICluster[], void>({
            query: () => ({
                url: '/api/private/clusters',
            }),
        }),
        fetchCluster: builder.query<IFetchClusterResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/private/clusters/${id}`,
            }),
        }),
        putCluster: builder.mutation<
            ICluster,
            { id: string; body: IClusterPutBody }
        >({
            query: ({ id, body }) => ({
                method: 'PUT',
                url: `/api/private/clusters/${id}`,
                body,
            }),
        }),
        deleteCluster: builder.mutation<IClusterDeleteResponse, { id: string }>(
            {
                query: ({ id }) => ({
                    method: 'DELETE',
                    url: `/api/private/clusters/${id}`,
                }),
            }
        ),
    }),
})

export const {
    usePostClusterMutation,
    useFetchClustersQuery,
    useFetchClusterQuery,
    usePutClusterMutation,
    useDeleteClusterMutation,
} = clustersApi
