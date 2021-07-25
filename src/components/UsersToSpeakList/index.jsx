import socket from "../../socket"
import UserCard from "../UserCard"
import './index.css'

const UsersToSpeakList = ({users, closeConnections, hide}) => {
    const usersToSpeak = (users) => {
        if (users.length) {
            return users.map( user => {
                return (
                    <div key={user.id} className="card-container">
                        <UserCard user={user} />
                        <input className="input-button" onClick={() => {handlePass(user)}} type="button" value="choose" />
                    </div>
                )
            })
        }else {
           return <input className="input-button" onClick={handleEnd} type="button" value="End call" />
        }
    }

    const handlePass = user => {
        if (closeConnections) {
            closeConnections()
        }
        socket.emit('NextUserToSpeak', user.id)
        hide()
    }
    
    const handleEnd = () => {
        closeConnections()
        socket.emit("EndCall")
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