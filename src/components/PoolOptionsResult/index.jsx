import PoolOptionCard from '../PoolOptionCard'
import { useSelector } from 'react-redux'
import "./index.css"

const PoolOptionsResult = () => {
    const options = useSelector(state => state.pool)

    const renderResults = () => {
        const optionsList = orderedOptions()
        return optionsList.map(option => {
            return <PoolOptionCard key={option.id} option={option} mode="results"/>
        })
    }

    const orderedOptions = () => {
        const optionArray = [...options].sort((a, b) => {
            if (a.votes.length > b.votes.length) {
                return -1
            }
            if (a.votes.length < b.votes.length) {
                return 1
            }
            return 0
        })

        return optionArray
    }
    
    return(
        <div className="results-container">
            <h3 style={{"position" : "absolute", "top": "-20px"}}>Pool results.</h3>
            {renderResults()}
        </div>
    )
}

export default PoolOptionsResult