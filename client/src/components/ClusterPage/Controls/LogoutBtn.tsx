import { Button } from 'antd'
import { useLogout } from '../../../hooks/store/auth.api'

export default function LogoutBtn() {
    const logout = useLogout()

    return (
        <Button
            style={{ marginTop: 10 }}
            type="primary"
            onClick={() => logout()}
        >
            Logout
        </Button>
    )
}
