import axios from 'axios'
import {useState, useEffect} from 'react'

function App() {

    const [data, setData] = useState([])
    const [success, setSuccesss] = useState(false)

    useEffect(() => {
        axios.get('http://localhost:8800/users')
        .then(response => {
            setData(response.data)
        })
    .catch(() => {

    });
    }, []);

    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Password: ''
    })

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8800/users/submit-form', formData)
        .then(() => {
            setSuccesss(true);
        })
        .catch(() => {

        })
    };




    return (
        <>
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="Name" onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="text" name="Email" onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input type="text" name="Password" onChange={handleChange} />
                </label>
                <button type="submit">Submit</button>
                <div>
                    {success && <p>Form is submitted</p>}
                </div>
            </form>
            {data.map(item => (
                <div key={item.id}>
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
        </>
    )
}

export default App
