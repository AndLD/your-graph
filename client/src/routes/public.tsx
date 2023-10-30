import { RouteObject } from 'react-router-dom'
import Auth from '../pages/Auth'
import Verification from '../pages/Verification.tsx'

const publicRoutes: RouteObject[] = [
    {
        path: '/auth',
        element: <Auth />,
    },
    { path: '/verification', element: <Verification /> },
]

export default publicRoutes
