import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    IFetchUsersResponse,
    IUserPostBody,
    IUserPostResponse,
} from '../utils/interfaces/user'
import { baseQueryWithRefresh } from '../utils/store'
import { API_URL } from '../utils/constants'

export const privateUsersApi = createApi({
    reducerPath: '/api/private/users',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        fetchUsers: builder.query<
            IFetchUsersResponse,
            {
                pagination: { current: number; pageSize: number }
                filters?: string
                order?: string
            }
        >({
            query: ({ pagination, filters, order }) => ({
                url: '/api/private/users',
                params: {
                    page: pagination.current,
                    results: pagination.pageSize,
                    filters,
                    order,
                },
            }),
        }),
    }),
})

export const publicUsersApi = createApi({
    reducerPath: '/api/public/users',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        fetchVerifyEmail: builder.query<
            void,
            { emailVerificationToken: string | null }
        >({
            query: ({ emailVerificationToken }) => ({
                url: '/api/public/users/verify',
                params: {
                    token: emailVerificationToken,
                },
                responseHandler: 'text',
            }),
        }),
        postUser: builder.mutation<IUserPostResponse, IUserPostBody>({
            query: (body) => ({
                method: 'POST',
                url: '/api/public/users',
                body,
            }),
        }),
    }),
})

export const { useFetchUsersQuery } = privateUsersApi
export const { useFetchVerifyEmailQuery, usePostUserMutation } = publicUsersApi
