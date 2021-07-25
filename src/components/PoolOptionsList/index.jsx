import { useState } from 'react'
import socket from "../../socket"
import { useSelector, useDispatch } from 'react-redux'
import { clearVotes } from '../../reducers/poolSlice'
import PoolOptionCard from '../PoolOptionCard'
import UserPointCard from '../UserPointCard'
import PointCard from '../PointCard'
import "./index.css"

const PoolOptionsList = () => {
    const currentUserSelect = useSelector(state => state.currentUser)
    const poolSlice = useSelector(state => state.pool)

    const [story, setStory] = useState({})
    const [alreadyVote, setAlreadyVote] = useState(false)
    const [show, setShow] = useState(false)

    const dispatch = useDispatch()

    socket.on("Results", () => {
        console.log("results", show);
        setShow(true)
    })

    socket.on("SetStory", story => {
        if (alreadyVote) {
            console.log("yikes");
            setAlreadyVote(false)
            setShow(false)
            dispatch(clearVotes())
        }
        setStory(story)
    })

    const renderPool = () => {
        if(alreadyVote) {
            return <div className="options-await-container">
                    {show ? <h3 style={{"marginBottom" : "5px"}}>Results!.</h3> :<h3 style={{"marginBottom" : "5px"}}>Waiting for host to end pointing.</h3>}
                    {renderUsersPoints(poolSlice)}
                    {!show && <input className="input-button" type="button" value="Change Vote" onClick={handleRemoveVote} />}
                </div>
        }
        return <div>
                <h3>Point an apropriatte value for the story:</h3>
                <PoolOptionCard story={story} />
                <div className="options-list-container">{renderPoolOptions()}</div>
            </div> 
    }

    const renderUsersPoints = (p) => {
        return p.map(p => {
            return <UserPointCard key={p.user.userId} user={p.user} value={p.value} show={show} />
        })
    }

    const renderPoolOptions = () => {
        const presetValues = [0, 0.5, 1, 3, 5, 8, 13, 20, 40, 100, "?"]
        return presetValues.map(value => {
            return <PointCard key={value} value={value} handleVote={handleVote} />
        })
    }

    const handleVote = (value) => {
        const votePayload = {
            value, 
            user: {
                id:currentUserSelect.id, 
                userName:currentUserSelect.userName
            }
        }
        socket.emit("Point", votePayload)

        setAlreadyVote(true)
    }

    const handleRemoveVote = () => {
        const userId = currentUserSelect.id
        
        socket.emit("RemovePoint", userId)
        
        setAlreadyVote(false)
    }

    return(
        <div >
            {renderPool()}
        </div>
    )
}

export default PoolOptionsList