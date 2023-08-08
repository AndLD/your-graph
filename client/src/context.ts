import { createContext } from 'react'
import useClusterContextValue from './hooks/useClusterContextValue'
import useLayoutContext from './hooks/pages/layout'

export const clusterContext = createContext({} as ReturnType<typeof useClusterContextValue>)
export const layoutContext = createContext<any>({} as ReturnType<typeof useLayoutContext>)
