import { useContext } from 'react'
import { clustersContext } from '../../context'
import { Empty } from 'antd'
import ClusterRow from './ClusterRow'

export default function ClustersMenu() {
    const [clusters, setClusters] = useContext(clustersContext).clustersState

    return (
        <div style={{ minHeight: 300, maxHeight: '50vh', overflowY: 'scroll' }}>
            {clusters.length ? (
                clusters.map((cluster) => (
                    <ClusterRow cluster={cluster} key={cluster._id} />
                ))
            ) : (
                <Empty />
            )}
        </div>
    )
}
