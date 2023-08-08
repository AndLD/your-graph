import { useContext, useEffect } from 'react'
import { usersContext } from '../../contexts'
import { gameSlice } from '../../store/game.reducer'
import {
    useFetchUserProgressQuery,
    useFetchUsersQuery,
    useFetchVerifyEmailQuery,
    usePutUserMutation,
    usePutUserProgressMutation
} from '../../store/users.api'
import { IPagination } from '../../utils/interfaces/common'
import { IUserInfo, UserStatus } from '../../utils/interfaces/user'
import { errorNotification } from '../../utils/notifications'
import { useToken } from '../auth'
import { useAppDispatch, useAppSelector } from './'

export function useFetchUsers(pagination: IPagination, callback: (result: IUserInfo[]) => void) {
    const token = useToken()

    const fetchUsersQuery = useFetchUsersQuery({ pagination, filters: 'active,==,true' }, { skip: !token })

    useEffect(() => {
        if (fetchUsersQuery.data) {
            callback(fetchUsersQuery.data.result)
        }
    }, [fetchUsersQuery.data])
}

export function useFetchUserProgress() {
    const token = useToken()
    const fetchUserProgressQuery = useFetchUserProgressQuery()

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (fetchUserProgressQuery.data?.result) {
            dispatch(gameSlice.actions.setUserProgress(fetchUserProgressQuery.data.result))
        }
    }, [fetchUserProgressQuery.data])

    useEffect(() => {
        fetchUserProgressQuery.refetch()
    }, [token])
}

export function usePutUser() {
    const [tableData, setTableData] = useContext(usersContext).tableDataState

    const [putUserMutation] = usePutUserMutation()

    return (id: string, status: UserStatus) =>
        putUserMutation({
            id,
            body: {
                status
            }
        }).then((value: any) => {
            if (value.data) {
                const user = value.data.result
                const newStatus = user?.status
                if (newStatus === status) {
                    setTableData([
                        ...tableData.map((tr: IUserInfo) => {
                            if (tr.id === id) {
                                return user
                            }
                            return tr
                        })
                    ])
                } else {
                    errorNotification('Статус користувача не оновлено', 'Не вдалося оновити користувача')
                }
            } else {
                const error = value.error?.msg || value.error?.data?.error
                errorNotification(error, 'Не вдалося оновити користувача')
            }
        })
}

export function usePutUserProgress() {
    const dispatch = useAppDispatch()
    const userProgress = useAppSelector((state) => state.gameReducer.userProgress)

    const [putUserProgressMutation] = usePutUserProgressMutation()

    return (currentTaskId: string | null) => {
        if (!userProgress) {
            return
        }

        putUserProgressMutation({
            body: {
                currentTaskId
            }
        }).then((value: any) => {
            if (value.data) {
                const newUserProgress = value.data.result
                dispatch(gameSlice.actions.setUserProgress(newUserProgress))
            } else {
                const error = value.error?.msg || value.error?.data?.error
                errorNotification(error, 'Обрати завданння не вдалося')
            }
        })
    }
}

export function useVerifyEmail(emailVerificationToken: string | null, callback: () => void) {
    const fetchVerifyEmailQuery = useFetchVerifyEmailQuery({ emailVerificationToken })

    useEffect(() => {
        if (fetchVerifyEmailQuery.isSuccess) {
            callback()
        }
    }, [fetchVerifyEmailQuery.isSuccess])

    useEffect(() => {
        if (fetchVerifyEmailQuery.isError) {
            errorNotification('Помилка підтвердження Email')
            callback()
        }
    }, [fetchVerifyEmailQuery.isError])
}
