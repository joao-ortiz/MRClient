import { useState } from "react"
import StoryForm from "../StoryForm"
import "./index.css"

const StoryManager = ({start, end}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const story = () => {
        return {title, description}
    }

    return (
        <div className="pool-options-manager">
            <h2 style={{"marginBottom": "5px"}} >Create a story!</h2>
            <StoryForm title={title} description={description} setTitle={setTitle} setDescription={setDescription} />
            <div className="actions">
                <input type="button" value="Start pointing" onClick={() => start(story())} className="input-button" />
                <input style={{"marginTop": "5px"}} type="button" value="Show results" onClick={end} className="input-button" />
            </div>
        </div>
    )
}

export default  StoryManager