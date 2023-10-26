import ClustersMenu from '../components/ClustersPage/ClustersMenu'
import useClustersContextValue from '../hooks/pages/clusters'
import { clustersContext } from '../context'
import { Button } from 'antd'

export default function Clusters() {
    return (
        <clustersContext.Provider value={useClustersContextValue()}>
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Clusters Menu</h1>
                    <ClustersMenu />
                    <div>
                        <Button type="primary">Primary Button</Button>
                    </div>
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
        </clustersContext.Provider>
    )
}
