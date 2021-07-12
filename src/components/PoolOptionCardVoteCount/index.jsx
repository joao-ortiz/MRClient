import "./index.css"

const PoolOptionCardVoteCount = ({votes}) => {
    const renderUsers = () => {
        return votes.map(vote => {
            return <p key={vote.userId} className="user-name">{vote.userName}</p>
        })
    }

    return (
        <div className="result-container">
            Votes: {votes.length}
                <div className="vote-users-list">
                    <p>Users:</p>
                    {renderUsers()}
                </div>
        </div>
    )
}

export default PoolOptionCardVoteCount