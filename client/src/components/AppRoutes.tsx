import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import privateRoutes from '../routes/private'
import publicRoutes from '../routes/public'
// import Forbidden from '../pages/Forbidden'
import { IUserState } from '../utils/interfaces/user'
import { parseUser } from '../utils/jwt'
import { useToken } from '../hooks/auth'
import { layoutContext } from '../context'
import useLayoutContext from '../hooks/pages/layout'
// import { inactiveRoutes } from '../routes/inactiveRoutes'

export default function AppRoutes() {
    const token = useToken()

    const [routes, setRoutes] = useState<RouteObject[]>([])
    const [redirectRoute, setRedirectRoute] = useState<string | null>(null)

    useEffect(() => {
        const user: IUserState | null = parseUser(token)

        if (user && !user.active) {
            // setRoutes(inactiveRoutes)
            // setRedirectRoute('/forbidden')
            return
        }

        if (token) {
            switch (user?.status) {
                case 'admin':
                    setRoutes(privateRoutes)
                    setRedirectRoute('/admin')
                    break
                case 'owner':
                    setRoutes(privateRoutes)
                    setRedirectRoute('/admin')
                    break
                case 'user':
                    setRoutes(privateRoutes.filter((route) => route.path === '/cluster'))
                    setRedirectRoute('/cluster')
                    break
                case 'unlimited':
                    setRoutes(privateRoutes.filter((route) => route.path === '/cluster'))
                    setRedirectRoute('/cluster')
                    break
                default:
                    // setRoutes([{ path: '/forbidden', element: <Forbidden /> }])
                    // setRedirectRoute('/forbidden')
                    break
            }
        } else {
            setRoutes(publicRoutes)
            setRedirectRoute('/auth')
        }
    }, [token])

    const routing = useRoutes(
        redirectRoute ? [...routes, { path: '*', element: <Navigate replace to={redirectRoute} /> }] : routes
    )

    return <layoutContext.Provider value={useLayoutContext()}>{routing}</layoutContext.Provider>
}
