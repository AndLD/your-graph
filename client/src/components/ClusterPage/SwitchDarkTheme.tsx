import { Switch, Tooltip } from 'antd'
import { clusterContext } from '../../context'
import { useContext } from 'react'

export default function SwitchDarkTheme() {
    const {
        darkThemeEnabledState: [darkThemeEnabled, setDarkThemeEnabled]
    } = useContext(clusterContext)

    const onChange = () => {
        setDarkThemeEnabled(!darkThemeEnabled)
    }

    return (
        <div>
            <Tooltip placement="left" title="Dark theme">
                <Switch checked={darkThemeEnabled} onChange={onChange} />
            </Tooltip>
        </div>
    )
}
