import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithRefresh } from '../utils/store'
import {
    INode,
    INodePositionPutBody,
    INodePut,
} from '../utils/interfaces/nodes'

export const nodesApi = createApi({
    reducerPath: 'nodes/api',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        postNode: builder.mutation<
            INode,
            {
                clusterId: string
                selectedNodeId?: string
                type?: 'child' | 'parent'
                body: { x?: number; y?: number }
            }
        >({
            query: ({ clusterId, selectedNodeId, type, body }) => ({
                method: 'POST',
                url: `/api/private/clusters/${clusterId}/nodes`,
                params: {
                    selectedNodeId,
                    type,
                },
                body,
            }),
        }),
        // fetchClusters: builder.query<ICluster[], void>({
        //     query: () => ({
        //         url: '/api/private/clusters',
        //     }),
        // }),
        // fetchCluster: builder.query<IFetchClusterResponse, { id: string }>({
        //     query: ({ id }) => ({
        //         url: `/api/private/clusters/${id}`,
        //     }),
        // }),
        putNodesPosition: builder.mutation<
            INode,
            { clusterId: string; body: INodePositionPutBody[] }
        >({
            query: ({ clusterId, body }) => ({
                method: 'PUT',
                url: `/api/private/clusters/${clusterId}/nodes`,
                body,
            }),
        }),
        putNode: builder.mutation<
            INode,
            { clusterId: string; selectedNodeId: string; body: INodePut }
        >({
            query: ({ clusterId, selectedNodeId, body }) => ({
                method: 'PUT',
                url: `/api/private/clusters/${clusterId}/nodes/${selectedNodeId}`,
                body,
            }),
        }),
        deleteNode: builder.mutation<
            INode,
            { clusterId: string; selectedNodeId: string }
        >({
            query: ({ clusterId, selectedNodeId }) => ({
                method: 'DELETE',
                url: `/api/private/clusters/${clusterId}/nodes/${selectedNodeId}`,
            }),
        }),
    }),
})

export const {
    usePostNodeMutation,
    usePutNodesPositionMutation,
    usePutNodeMutation,
    useDeleteNodeMutation,
} = nodesApi
