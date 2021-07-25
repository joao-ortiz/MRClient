import "./index.css"

const PoolOptionCard = ({story, handleDelete}) => {
    const renderCardExtra = () => {
        if(handleDelete) {
            return <input type="button" className="input-button" onClick={handleDelete} value="Delete" />
        }   
    }

    return (
        <div className="story-card-container">
            <div className="story-card-info">
            <h3 className="story-title">{story.title}</h3>
            <p className="story-description">{story.description}</p>
            </div>
            {renderCardExtra()}
        </div>
    )
}

export default PoolOptionCard