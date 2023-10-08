import AddNodeBtn from './AddNodeBtn'
import MyProgress from './MyProgress'
import SwitchDarkTheme from './SwitchDarkTheme'
import LogoutBtn from './LogoutBtn'

export default function Controls() {
    return (
        <div
            style={{
                position: 'absolute',
                top: 50,
                right: 50,
                fontSize: 20,
                textAlign: 'center',
            }}
        >
            <AddNodeBtn />
            {/* <SwitchHierarchical /> */}
            <SwitchDarkTheme />
            <MyProgress />
            <LogoutBtn />
        </div>
    )
}
