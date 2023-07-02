import SwitchHierarchical from './SwitchHierarchical'
import AddNodeBtn from './AddNodeBtn'
import MyProgress from './MyProgress'

export default function Controls() {
    return (
        <div style={{ position: 'absolute', top: 50, right: 50, fontSize: 20, textAlign: 'center' }}>
            <AddNodeBtn />
            <SwitchHierarchical />
            <MyProgress />
        </div>
    )
}
