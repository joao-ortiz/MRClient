
import "./index.css"

const PoolOptionsForm = ({title, description, setDescription, setTitle}) => {

    return(
        <div className="pool-option-form">
            <div className="input-container">
                <input onChange={(e) => {setTitle(e.target.value)}} value={title} type="text" name="title" className="input-field" required={true} />
                <label htmlFor="title" className="input-field-label">Title</label>
            </div>
            
            <div className="input-container">
                <input onChange={(e) => {setDescription(e.target.value)}} value={description} type="text" name="description" className="input-field" required={true} />
                <label htmlFor="description" className="input-field-label">Description</label>
            </div>

        </div>
    )
}

export default PoolOptionsForm