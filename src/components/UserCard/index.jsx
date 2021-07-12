import Icon from '../../assets/Sample_User_Icon.png'
import "./index.css"

const UserCard = ({user}) => {
    return(
        <div className="card">
            <img className="card-icon" src={Icon} alt="" />
            <p className="user-name">
                Name: {user.userName}
            </p>
        </div>
    )
}

export default UserCard