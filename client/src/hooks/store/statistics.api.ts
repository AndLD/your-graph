import { useEffect } from 'react'
import { useFetchStatisticsQuery } from '../../store/statistics.api'
import { IStatistics } from '../../utils/interfaces/statistics'
import { useToken } from '../auth'

export function useFetchStatistics(callback: (result: IStatistics) => void) {
    const token = useToken()

    const fetchStatisticsQuery = useFetchStatisticsQuery(undefined, { skip: !token })

    useEffect(() => {
        if (fetchStatisticsQuery.data) {
            callback(fetchStatisticsQuery.data.result)
        }
    }, [fetchStatisticsQuery.data])
}
