import { createContext } from 'react'
import useClusterContextValue from './hooks/pages/cluster'
import useLayoutContext from './hooks/pages/layout'
import useClustersContextValue from './hooks/pages/clusters'

export const clusterContext = createContext(
    {} as ReturnType<typeof useClusterContextValue>
)
export const clustersContext = createContext(
    {} as ReturnType<typeof useClustersContextValue>
)
export const layoutContext = createContext<any>(
    {} as ReturnType<typeof useLayoutContext>
)
