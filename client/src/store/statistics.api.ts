import { createApi } from '@reduxjs/toolkit/query/react'
import { IFetchStatisticsResponse } from '../utils/interfaces/statistics'
import { baseQueryWithRefresh } from '../utils/store'

export const statisticsApi = createApi({
    reducerPath: 'statistics/api',
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        fetchStatistics: builder.query<IFetchStatisticsResponse, void>({
            query: () => ({
                url: '/api/private/statistics'
            })
        })
    })
})

export const { useFetchStatisticsQuery } = statisticsApi
