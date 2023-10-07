import { RouteObject } from 'react-router-dom'
import Cluster from '../pages/Cluster'
import Authorized from '../pages/Authorized'
// import Dashboard from '../pages/Dashboard'
// import AdminLayout from '../components/AdminLayout'
// import Settings from '../pages/Settings'
// import Users from '../pages/Users'

const privateRoutes: RouteObject[] = [
    // {
    //     path: '/admin',
    //     // element: <AdminLayout />,
    //     children: [
    //         // {
    //         //     path: '/admin',
    //         //     element: <Dashboard />
    //         // },
    //         // {
    //         //     path: '/admin',
    //         //     element: <Dashboard />
    //         // },
    //         // {
    //         //     path: '/admin/users',
    //         //     element: <Users />
    //         // },
    //         // {
    //         //     path: '/settings',
    //         //     element: <Settings />
    //         // }
    //     ]
    // },
    {
        path: '/cluster',
        element: <Cluster />,
    },
    {
        path: '/authorized',
        element: <Authorized />,
    },
]

export default privateRoutes
