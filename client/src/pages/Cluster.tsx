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
import BackButton from '../components/ClusterPage/BackButton.tsx'
import '../styles/Cluster.scss'

export default function Cluster() {
    return (
        <clusterContext.Provider value={useClusterContextValue()}>
            <div className="screen-container">
                <BackButton />
                <SearchContainer />
                <UpdateNodeFormWrapper />
                <SelectCategoryModal />
                <CreateCategoryModal />
                <ImageContainer />
                <TitleContainer />
                <MyGraph />
                <Controls />
            </div>
        </clusterContext.Provider>
    )
}
