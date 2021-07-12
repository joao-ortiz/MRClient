import PoolOptionCardVoteCount from '../PoolOptionCardVoteCount'
import "./index.css"

const PoolOptionCard = ({option, handleDelete, handleVote, mode}) => {
    const renderCardExtra = () => {
        if(mode === "vote") {
            return <input type="button" className="input-button" onClick={() => {handleVote(option.id)}} value="Vote" />
        }else if (mode === "results") {
            return <PoolOptionCardVoteCount votes={option.votes} />
        }
        return <input type="button" className="input-button" onClick={() => {handleDelete(option.id)}} value="Delete" />
    }

    return (
        <div className="option-card-container">
            <div className="option-card-info">
            <h3 className="option-title">{option.title}</h3>
            <p className="option-description">{option.description}</p>
            </div>
            
            {renderCardExtra()}
        </div>
    )
}

export default PoolOptionCard