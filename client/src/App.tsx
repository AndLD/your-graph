import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './components/AppRoutes'
import { clustersContext } from './context'
import useClustersContextValue from './hooks/pages/clusters'

function App() {
    // useAuth()

    return (
        <BrowserRouter>
            <clustersContext.Provider value={useClustersContextValue()}>
                <AppRoutes />
            </clustersContext.Provider>
        </BrowserRouter>
    )
}

export default App
