import { useState } from "react"
import PoolOptionCard from "../PoolOptionCard"
import PoolOptionsForm from "../PoolOptionsForm"
import "./index.css"

const PoolOptionsManager = ({start, end}) => {
    const [options, setOptions] = useState([])

    const handleDelete = (optionId) => {
        setOptions(options => options.filter(o => o.id !== optionId))
    }

    const handleAdd = (option) => {
        if(option.title.length) {
            setOptions(options => [...options, option])
    }else {
        window.alert("You need to fill at least the title")
    }

        }
        

    const renderPoolOptions = () => {
        return options.map(option => {
            return <PoolOptionCard key={option.id} option={option} handleDelete={handleDelete} />
        })
    }

    return (
        <div className="pool-options-manager">
            <PoolOptionsForm handleAdd={handleAdd} />
            {renderPoolOptions()}
            <div className="actions">
                <input type="button" value="Start" onClick={() => start(options)} className="input-button" />
                <input style={{"margin-top": "5px"}} type="button" value="Show Results" onClick={end} className="input-button" />
            </div>
        </div>
    )
}

export default  PoolOptionsManager