import UserCard from "../UserCard"
import "./index.css"

const UserList = ({users}) => {

    const renderUsers = () => {
        return users.map(user => {
            return <UserCard key={user.id} user={user} />
        })
    }
    return(
        <div className="users-list-container">
            <p className="list-title">Current users in the room:</p>
            <div className="users-list">
            
            {renderUsers()}
        </div>
        </div>
    )
}

export default UserList