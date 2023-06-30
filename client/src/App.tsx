import MyGraph from './components/MyGraph'
import AddNodeBtn from './components/AddNodeBtn'
import { appContext } from './context'
import useContextValue from './hooks/useContextValue'
import UpdateNodeForm from './components/UpdateNodeForm'

function App() {
    return (
        <appContext.Provider value={useContextValue()}>
            <MyGraph />
            <AddNodeBtn />
            <UpdateNodeForm />
        </appContext.Provider>
    )
}

export default App
