import { useEffect, useState } from 'react'
import { ICluster } from '../../utils/interfaces/clusters'
import { useFetchClusters } from '../store/clusters.api'

export default function useClustersContextValue() {
    const clustersState = useState<ICluster[]>([])

    useFetchClusters(clustersState[1])

    return {
        clustersState,
    }
}
