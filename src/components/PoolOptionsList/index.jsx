import { useState } from 'react'
import { useDispatch } from "react-redux"
import socket from "../../socket"
import { userVote, removeUserVote } from "../../reducers/poolSlice"
import { useSelector } from 'react-redux'
import PoolOptionCard from '../PoolOptionCard'
import "./index.css"

const PoolOptionsList = () => {
    const currentUserSelect = useSelector(state => state.currentUser)
    const poolOptionsSelect = useSelector(state => state.pool)
    
    const [alreadyVote, setAlreadyVote] = useState(false)
    
    const dispatch = useDispatch()

    const renderPool = () => {
        if(alreadyVote) {
            return <div className="options-await-container">
                    <h3 style={{"margin-bottom" : "5px"}}>Waiting for host to end voting.</h3>
                    <input className="input-button" type="button" value="Change Vote" onClick={handleRemoveVote} />
                </div>
        }
        return <div><h3>Select an option:</h3><div className="options-list-container">{renderPoolOptions()}</div></div> 
    }

    const renderPoolOptions = () => {
        return poolOptionsSelect.map(option => {
            return <PoolOptionCard key={option.id} option={option} mode="vote" handleVote={handleVote}/>
        })
    }

    const handleVote = (optionId) => {
        const votePayload = {optionId,user: {userId:currentUserSelect.id, userName:currentUserSelect.userName}}

        socket.emit("Vote", votePayload)
            dispatch(userVote(votePayload))
        
        setAlreadyVote(true)
    }

    const handleRemoveVote = () => {
        const userId = currentUserSelect.id
        socket.emit("RemoveVote", userId)
            dispatch(removeUserVote(userId))
        
        setAlreadyVote(false)
    }

    return(
        <div className="options-list-container">
            {renderPool()}
        </div>
    )
}

export default PoolOptionsList