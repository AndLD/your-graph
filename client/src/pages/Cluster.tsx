import { clusterContext } from '../context'
import useClusterContextValue from '../hooks/pages/cluster'
import MyGraph from '../components/ClusterPage/MyGraph'
import Controls from '../components/ClusterPage/Controls/Controls'
import UpdateNodeFormWrapper from '../components/ClusterPage/UpdateNodeFormWrapper'
import ImageContainer from '../components/ClusterPage/ImageContainer'
import TitleContainer from '../components/ClusterPage/TitleContainer'
import SearchContainer from '../components/ClusterPage/SearchContainer'
import CreateCategoryModal from '../components/ClusterPage/Category/CreateCategoryModal'
import SelectCategoryModal from '../components/ClusterPage/SelectCategoryModal'

export default function Cluster() {
    return (
        <clusterContext.Provider value={useClusterContextValue()}>
            <SearchContainer />
            <UpdateNodeFormWrapper />
            <SelectCategoryModal />
            <CreateCategoryModal />
            <ImageContainer />
            <TitleContainer />
            <MyGraph />
            <Controls />
        </clusterContext.Provider>
    )
}
