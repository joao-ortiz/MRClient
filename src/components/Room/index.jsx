import UserList from '../UserList'
import UserSpeaking from '../UserSpeaking'
import PoolOptionsList from '../PoolOptionsList'
import PoolOptionsResult from '../PoolOptionsResult'
import RoomManager from '../RoomManager'
import { useSelector } from 'react-redux'
import "./index.css"

const Room = ({mode}) => {
    const usersSelect = useSelector(state => state.users)
    const currentUserSelect = useSelector(state => state.currentUser)

    const renderRoomMode = () => {
        if(mode === "call") {
            return <UserSpeaking />
        } else if (mode === "results") {
            return <PoolOptionsResult />
        }
        return <PoolOptionsList />
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