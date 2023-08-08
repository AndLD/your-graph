import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appReducer from './app.reducer'
import adminReducer from './admin.reducer'
import { privateUsersApi, publicUsersApi } from './users.api'
import { authApi } from './auth.api'
import { statisticsApi } from './statistics.api'

const rootReducer = combineReducers({
    appReducer,
    adminReducer,
    [authApi.reducerPath]: authApi.reducer,
    [privateUsersApi.reducerPath]: privateUsersApi.reducer,
    [publicUsersApi.reducerPath]: publicUsersApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(
                authApi.middleware,
                privateUsersApi.middleware,
                publicUsersApi.middleware,
                statisticsApi.middleware
            )
        }
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
