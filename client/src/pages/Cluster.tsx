import { clusterContext } from '../context'
import useClusterContextValue from '../hooks/useClusterContextValue'
import MyGraph from '../components/ClusterPage/MyGraph'
import Controls from '../components/ClusterPage/Controls'
import UpdateNodeFormWrapper from '../components/ClusterPage/UpdateNodeFormWrapper'
import ImageContainer from '../components/ClusterPage/ImageContainer'
import TitleContainer from '../components/ClusterPage/TitleContainer'
import SearchContainer from '../components/ClusterPage/SearchContainer'

export default function Cluster() {
    return (
        <clusterContext.Provider value={useClusterContextValue()}>
            <SearchContainer />
            <UpdateNodeFormWrapper />
            <ImageContainer />
            <TitleContainer />
            <MyGraph />
            <Controls />
        </clusterContext.Provider>
    )
}
