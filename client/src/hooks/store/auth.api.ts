import { useLogoutMutation, useRefreshTokenMutation } from '../../store/auth.api'
import { appSlice } from '../../store/app.reducer'
import { errorNotification } from '../../utils/notifications'
import { useAppDispatch } from '.'

export function useLogout() {
    const dispatch = useAppDispatch()

    const [logout] = useLogoutMutation()

    return () => {
        logout().then((value: any) => {
            if (value.error) {
                errorNotification(value.error?.error, 'Не вдалося вийти з системи')
            } else {
                dispatch(appSlice.actions.setToken(null))
            }
        })
    }
}

export function useRefreshToken(callback?: () => void) {
    const dispatch = useAppDispatch()

    const [refreshTokenMutation] = useRefreshTokenMutation()

    return () => {
        refreshTokenMutation()
            .then((value: any) => {
                if (value.data) {
                    const token = value.data.result
                    if (token) {
                        dispatch(appSlice.actions.setToken(token))
                    }
                } else if (value.error) {
                    dispatch(appSlice.actions.setToken(null))
                }
            })
            .finally(callback)
    }
}
