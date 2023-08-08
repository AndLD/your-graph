import { RouteObject } from 'react-router-dom'
import Cluster from '../pages/Cluster'
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
        element: <Cluster />
    }
]

export default privateRoutes
