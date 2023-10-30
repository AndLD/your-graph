import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
    isMenuCollapsed: boolean
}

const initialState: IState = {
    isMenuCollapsed: localStorage.getItem('isMenuCollapsed') === 'true' ? true : false
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setIsMenuCollapsed(state, action: PayloadAction<boolean>) {
            state.isMenuCollapsed = action.payload
            localStorage.setItem('isMenuCollapsed', action.payload.toString())
        }
    }
})

export default adminSlice.reducer
