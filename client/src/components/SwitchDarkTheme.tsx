import { Switch, Tooltip } from 'antd'
import { appContext } from '../context'
import { useContext } from 'react'

export default function SwitchDarkTheme() {
    const {
        darkThemeEnabledState: [darkThemeEnabled, setDarkThemeEnabled]
    } = useContext(appContext)

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
