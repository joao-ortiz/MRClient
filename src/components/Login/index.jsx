import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserName } from '../../reducers/currentUserSlice'
import socket from '../../socket'
import './index.css'
const Login = () => {
    const [name, setName] = useState('')
    const currentUserSelect = useSelector(state => state.currentUser)
    const dispatch = useDispatch()

    const handleJoin = () => {
        if (name.length > 0) {
            dispatch(
                setUserName(
                    name
                )
            )
            socket.emit('UserJoin', user())
            
            setName('')
        } else {
            alert("You need a username to join the meeting")
        }
    }

    const user = () => {
        return {
            ...currentUserSelect,
            userName: name
        }
    }
    return (
        <div className="login-container">
            <form>
                <h1 className="title">Type your username</h1>

                <div className="input-container">
                    <input required={true} onChange={(e) => setName(e.target.value)} type="text" name="username" id="" className="input-field" />
                    <label htmlFor="username" className="input-field-label">Username</label>
                </div>           

                <input onClick={ handleJoin } type="button" value="Join" className="input-button" />
            </form>
        </div>
    )
}

export default Login