import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import useFetch from '../utils/useFetch'
//import fetchInstance from '../utils/fetchInstance'

const HomePage = () => {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    let api = useFetch()

    useEffect(()=> {
        getNotes()
    }, [])


    let getNotes = async() => {
        let {response, data} = await api('/api/notes/')

        if(response.status === 200){
            setNotes(data)
        }
        
    }

    return (
        <div>
            <p>You are logged to the home page!</p>


            <ul>
                {notes.map(note => (
                    <li key={note.id} >{note.body}</li>
                ))}
            </ul>
        </div>
    )
}

export default HomePage
