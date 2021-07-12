import socket from "../../socket"
import UserCard from "../UserCard"
import './index.css'

const UsersToSpeakList = ({users, closeConnections, hide}) => {
    const usersToSpeak = (users) => {
        return users.map( user => {
            if (!user.alreadySpoke) {
                return (
                    <div key={String(Math.random()).substr(2,9)} className="card-container">
                        <UserCard key={String(Math.random()).substr(2,9)} user={user} />
                        <input className="input-button" onClick={() => {handlePass(user)}} type="button" value="choose" />
                    </div>
                )
            }
            return null
        })
    }

    const handlePass = user => {
        if ( closeConnections) {
            closeConnections()
        }
        socket.emit('NextUserToSpeak', user.id)
        hide()
    }
    
    return (
        <div className="fade" >
            <div className="users-to-speak-list">
            <span className="close-button" onClick={hide}>x</span>
                <h2 className="list-title">Choose the next user to speak </h2>
                <div className="list-container">{usersToSpeak(users)}</div>
            </div>
        </div>
    )
}

export default UsersToSpeakList