import './index.css'

const PointCard = ({value, handleVote}) => {
    return(
        <div onClick={() => handleVote(value)} className="point-card-container">
            <h3 className="value-display">{value}</h3>
        </div>
    )
}
export default PointCard