import { clusterContext } from '../context'
import useClusterContextValue from '../hooks/pages/cluster'
import MyGraph from '../components/ClusterPage/MyGraph'
import Controls from '../components/ClusterPage/Controls/Controls'
import UpdateNodeFormWrapper from '../components/ClusterPage/UpdateNodeFormWrapper'
import SelectCategoryModalWrapper from '../components/ClusterPage/SelectCategoryModalWrapper'
import ImageContainer from '../components/ClusterPage/ImageContainer'
import TitleContainer from '../components/ClusterPage/TitleContainer'
import SearchContainer from '../components/ClusterPage/SearchContainer'
import CreateCategoryModalWrapper from '../components/ClusterPage/Category/CreateCategoryModalWrapper'

export default function Cluster() {
    return (
        <clusterContext.Provider value={useClusterContextValue()}>
            <SearchContainer />
            <UpdateNodeFormWrapper />
            <SelectCategoryModalWrapper />
            <CreateCategoryModalWrapper />
            <ImageContainer />
            <TitleContainer />
            <MyGraph />
            <Controls />
        </clusterContext.Provider>
    )
}
