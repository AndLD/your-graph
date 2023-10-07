import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './components/AppRoutes'
import { useAuth } from './hooks/auth'

function App() {
    // useAuth()

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
}

export default App
