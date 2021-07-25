import './index.css'

const UserPointCard = ({value, user, show}) => {
    
    return(
        <div className="user-point-card-container">
            <p className="user-name">Name: {user.userName}</p>
            <div className="value-container" style={{"background": show ? "none" : "whitesmoke"}}>
                <p className="point-value" >Points: {value}</p>
            </div>
        </div>
    ) 
}
export default UserPointCard