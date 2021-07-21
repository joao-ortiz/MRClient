import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import UsersToSpeakList from "../UsersToSpeakList"
import socket from '../../socket'
import PoolOptionsManager from "../PoolOptionsManager"
import "./index.css"

const RoomManager = () => {
    const [showUserList, setShowUserList] = useState(false)
    const [votesCount, setCount] = useState(0)

    const usersSelect = useSelector(state => state.users)
    const currentUserSelect = useSelector(state => state.currentUser)
    
    useEffect(()=>{
        socket.on('UserVote', () => {
            console.log("vote");
            setCount(c => c + 1)
        })
        
        socket.on('RemoveVote', () => {
            setCount(c => c - 1)
        })
    },[])

    const handleMetingManage = () => {
        setShowUserList(true)
    }

    const handleStartVoting = (options) => {
        socket.emit("PoolOptions", options)
    }

    const handleEndVoting = () => {
        setCount(0)
        socket.emit("EndVotingSesh")
    }

    const handleRoomMode = mode => {
        socket.emit("SetRoomMode", mode)
    }

    return(
        <div className="manager-container">
            <h2 style={{"margin-bottom": "5px"}} >Room manager</h2>
            <input style={{"margin-bottom": "5px"}} className="input-button" type="button" value="Change room to Call" onClick={() => {handleRoomMode("call")}} />
            <input style={{"margin-bottom": "5px"}} className="input-button" type="button" value="Select user to speak" onClick={handleMetingManage} />
            {showUserList && <UsersToSpeakList users={[currentUserSelect, ...usersSelect]} hide={() => setShowUserList(false)} />}

            <div className="voting-crud-container">
                <h3>Manage pool options</h3>
                <div>{votesCount} User(s) already voted.</div>
                <PoolOptionsManager start={handleStartVoting} end={handleEndVoting} />
            </div>
            
        </div>
    )
}

export default RoomManager