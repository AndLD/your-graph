import { Switch, Tooltip } from 'antd'
import { clusterContext } from '../../../context'
import { useContext } from 'react'

export default function SwitchHierarchical() {
    const {
        hierarchicalEnabledState: [hierarchicalEnabled, setHierarchinalEnabled],
    } = useContext(clusterContext)

    const onChange = () => {
        setHierarchinalEnabled(!hierarchicalEnabled)
    }

    return (
        <div>
            <Tooltip placement="left" title="Hierarchical">
                <Switch checked={hierarchicalEnabled} onChange={onChange} />
            </Tooltip>
        </div>
    )
}
