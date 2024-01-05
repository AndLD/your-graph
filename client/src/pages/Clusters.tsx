import ClustersMenu from '../components/ClustersPage/ClustersMenu'
import { Button } from 'antd'
import ClusterCreateModal from '../components/ClustersPage/ClusterCreateModal'
import { useState } from 'react'

export default function Clusters() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const showModal = () => {
        setIsModalOpen(true)
    }
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Clusters Menu</h1>
                <ClustersMenu />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" onClick={showModal}>
                        Add Cluster
                    </Button>
                </div>

                <ClusterCreateModal
                    isModalOpenState={
                        [isModalOpen, setIsModalOpen] as [
                            boolean,
                            React.Dispatch<React.SetStateAction<boolean>>,
                        ]
                    }
                />
                {/* <p
                        style={{
                            marginTop: '15px',
                            cursor: 'pointer',
                            color: '#1677ff',
                            textAlign: 'right',
                        }}
                        // onClick={() => ()}
                    >
                        Manage Subscription
                    </p> */}
            </div>
        </div>
    )
}
