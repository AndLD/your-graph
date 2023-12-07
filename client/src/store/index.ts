import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appReducer from './app.reducer'
import adminReducer from './admin.reducer'
import { privateUsersApi, publicUsersApi } from './users.api'
import { authApi } from './auth.api'
import { statisticsApi } from './statistics.api'
import { clustersApi } from './clusters.api'
import { nodesApi } from './nodes.api'
import { connectionsApi } from './connections.api'
import { sourcesApi } from './sources.api'
import { categoriesApi } from './categories.api'

const rootReducer = combineReducers({
    appReducer,
    adminReducer,
    [authApi.reducerPath]: authApi.reducer,
    [privateUsersApi.reducerPath]: privateUsersApi.reducer,
    [publicUsersApi.reducerPath]: publicUsersApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    [clustersApi.reducerPath]: clustersApi.reducer,
    [nodesApi.reducerPath]: nodesApi.reducer,
    [connectionsApi.reducerPath]: connectionsApi.reducer,
    [sourcesApi.reducerPath]: sourcesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(
                authApi.middleware,
                privateUsersApi.middleware,
                publicUsersApi.middleware,
                statisticsApi.middleware,
                clustersApi.middleware,
                nodesApi.middleware,
                connectionsApi.middleware,
                sourcesApi.middleware,
                categoriesApi.middleware
            )
        },
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
