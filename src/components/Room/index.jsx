import UserList from '../UserList'
import UserSpeaking from '../UserSpeaking'
import PointingPoker from '../PointingPoker'
import RoomManager from '../RoomManager'
import { useSelector } from 'react-redux'
import "./index.css"

const Room = ({mode}) => {
    const usersSelect = useSelector(state => state.users)
    const currentUserSelect = useSelector(state => state.currentUser)

    const renderRoomMode = () => {
        if(mode === "call") {
            return <UserSpeaking />
        }
        return <PointingPoker />
    }

    return (
        <div className="room-container">
            {renderRoomMode()}

            {currentUserSelect.type === "host" && <RoomManager />}
            
            <UserList users={[currentUserSelect, ...usersSelect]}/>
        </div>
    )
}

export default Room