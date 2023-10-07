import { useEffect } from 'react'
import {
    useFetchUsersQuery,
    useFetchVerifyEmailQuery,
} from '../../store/users.api'
import { IUserInfo } from '../../utils/interfaces/user'
import { errorNotification } from '../../utils/notifications'
import { useToken } from '../auth'
import { IPagination } from '../../utils/interfaces/common.ts'

export function useFetchUsers(
    pagination: IPagination,
    callback: (result: IUserInfo[]) => void
) {
    const token = useToken()

    const fetchUsersQuery = useFetchUsersQuery(
        { pagination, filters: 'active,==,true' },
        { skip: !token }
    )

    useEffect(() => {
        if (fetchUsersQuery.data) {
            callback(fetchUsersQuery.data.result)
        }
    }, [fetchUsersQuery.data])
}

export function useVerifyEmail(
    emailVerificationToken: string | null,
    callback: () => void
) {
    const fetchVerifyEmailQuery = useFetchVerifyEmailQuery({
        emailVerificationToken,
    })

    useEffect(() => {
        console.log('000')
        if (fetchVerifyEmailQuery.isSuccess) {
            console.log('111')
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
