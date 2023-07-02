import { Switch, Tooltip } from 'antd'
import { appContext } from '../context'
import { useContext } from 'react'

export default function SwitchHierarchical() {
    const {
        hierarchicalEnabledState: [hierarchicalEnabled, setHierarchinalEnabled]
    } = useContext(appContext)

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
