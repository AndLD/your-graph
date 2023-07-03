import MyGraph from './components/MyGraph'
import Controls from './components/Controls'
import { appContext } from './context'
import useContextValue from './hooks/useContextValue'
import UpdateNodeFormWrapper from './components/UpdateNodeFormWrapper'
import ImageContainer from './components/ImageContainer'
import TitleContainer from './components/TitleContainer'
import SearchContainer from './components/SearchContainer'

function App() {
    return (
        <appContext.Provider value={useContextValue()}>
            <SearchContainer />
            <UpdateNodeFormWrapper />
            <ImageContainer />
            <TitleContainer />
            <MyGraph />
            <Controls />
        </appContext.Provider>
    )
}

export default App
