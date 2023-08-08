import { RouteObject } from 'react-router-dom'
import Auth from '../pages/Auth'

const publicRoutes: RouteObject[] = [
    {
        path: '/auth',
        element: <Auth />
    }
]

export default publicRoutes
