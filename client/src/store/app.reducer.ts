import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
    token: string | null
}

const initialState: IState = {
    token: localStorage.getItem('token')
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload
            if (action.payload) {
                localStorage.setItem('token', action.payload)
            } else {
                localStorage.removeItem('token')
            }
        }
    }
})

export default appSlice.reducer
