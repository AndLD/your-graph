import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { setupStore } from './store/index.ts'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={setupStore()}>
        <App />
    </Provider>
)
