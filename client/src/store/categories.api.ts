import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithRefresh } from '../utils/store'

import { ICategory, ICategoryPostBody } from '../utils/interfaces/categories'

export const categoriesApi = createApi({
    reducerPath: 'categories/api',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        postCategory: builder.mutation<
            ICategory,
            { clusterId: string; body: ICategoryPostBody }
        >({
            query: ({ clusterId, body }) => ({
                method: 'POST',
                url: `/api/private/clusters/${clusterId}/categories`,
                body,
            }),
        }),
        fetchCategories: builder.query<ICategory[], { clusterId: string }>({
            query: ({ clusterId }) => ({
                url: `/api/private/clusters/${clusterId}/categories`,
            }),
        }),
        // putSource: builder.mutation<
        //     ISource,
        //     { clusterId: string; id: string; body: ISourcePutBody }
        // >({
        //     query: ({ clusterId, id, body }) => ({
        //         method: 'PUT',
        //         url: `/api/private/clusters/${clusterId}/sources/${id}`,
        //         body,
        //     }),
        // }),
        // deleteSource: builder.mutation<
        //     ISource,
        //     { clusterId: string; id: string }
        // >({
        //     query: ({ clusterId, id }) => ({
        //         method: 'DELETE',
        //         url: `/api/private/clusters/${clusterId}/sources/${id}`,
        //     }),
        // }),
    }),
})

export const { usePostCategoryMutation, useFetchCategoriesQuery } =
    categoriesApi
