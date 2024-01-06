import Icon from '/back_arrow_icon.svg'
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate('/clusters')}
            style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 999,
                background: '#fff',
                cursor: 'pointer',
                height: 30,
                padding: 5,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <img
                src={Icon}
                style={{
                    width: 30,
                }}
            />
        </div>
    )
}
