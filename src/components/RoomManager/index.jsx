import { useState } from "react"
import { useSelector } from 'react-redux'
import UsersToSpeakList from "../UsersToSpeakList"
import socket from '../../socket'
import StoryManager from "../StoryManager"
import "./index.css"

const RoomManager = () => {
    const [showUserList, setShowUserList] = useState(false)

    const usersSelect = useSelector(state => state.users)
    const currentUserSelect = useSelector(state => state.currentUser)

    const handleMetingManage = () => {
        setShowUserList(true)
    }

    const handleStartVoting = (story) => {
        handleRoomMode("vote")
        socket.emit("NewStory", story)
    }

    const handleEndVoting = () => {
        socket.emit("Results")
    }

    const handleRoomMode = mode => {
        socket.emit("SetRoomMode", mode)
    }

    return(
        <div className="manager-container">
            <h2 style={{"marginBottom": "5px"}} >Room manager</h2>
            <input style={{"marginBottom": "5px"}} className="input-button" type="button" value="Change room to Call" onClick={() => {handleRoomMode("call")}} />
            <input style={{"marginBottom": "5px"}} className="input-button" type="button" value="Select user to speak" onClick={handleMetingManage} />
            {showUserList && <UsersToSpeakList users={[currentUserSelect, ...usersSelect]} hide={() => setShowUserList(false)} />}

            <div className="voting-crud-container">
                <h3>Manage pointing sesh.</h3>
                <StoryManager start={handleStartVoting} end={handleEndVoting} />
            </div>
            
        </div>
    )
}

export default RoomManager