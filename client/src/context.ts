import { createContext } from 'react'
import useContextValue from './hooks/useContextValue'

export const appContext = createContext({} as ReturnType<typeof useContextValue>)
