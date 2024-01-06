import { useNavigate } from 'react-router-dom'
import { ICluster } from '../../utils/interfaces/clusters'

interface IClusterRowProps {
    cluster: ICluster
}

export default function ClusterRow({ cluster }: IClusterRowProps) {
    const navigate = useNavigate()

    return (
        <div>
            <div
                className="highlight-on-hover"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 5,
                    marginBottom: 10,
                    padding: 10,
                    cursor: 'pointer',
                }}
                onClick={() => {
                    navigate(`/clusters/${cluster._id}`)
                }}
            >
                <div>{cluster.title}</div>
                <div>{cluster.access}</div>
            </div>
        </div>
    )
}
