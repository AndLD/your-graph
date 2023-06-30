import MyGraph from './components/MyGraph'
import AddNodeBtn from './components/AddNodeBtn'
import { appContext } from './context'
import useContextValue from './hooks/useContextValue'
import UpdateNodeFormWrapper from './components/UpdateNodeFormWrapper'
import ImageContainer from './components/ImageContainer'

function App() {
    return (
        <appContext.Provider value={useContextValue()}>
            <UpdateNodeFormWrapper />
            <ImageContainer />
            <MyGraph />
            <AddNodeBtn />
        </appContext.Provider>
    )
}

export default App
