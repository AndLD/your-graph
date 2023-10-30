import { LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// import { useToken } from '../hooks/auth'
// import { useRefreshToken } from '../hooks/store/auth.api'
import { useVerifyEmail } from '../hooks/store/users.api'
import '../styles/Verification.scss'

export default function Verification() {
    const [queryParams] = useSearchParams()
    const navigate = useNavigate()
    const emailVerificationToken = queryParams.get('token')

    const [isLoading, setIsLoading] = useState(true)

    // const token = useToken()
    // const refreshToken = useRefreshToken(() => setIsLoading(false))

    useVerifyEmail(emailVerificationToken, () => {
        navigate('/auth')
        // if (token) {
        //     refreshToken()
        // } else {
        //     setIsLoading(false)
        // }
    })

    return (
        <div className="verification-container">
            <LoadingOutlined />
        </div>
    )
}
