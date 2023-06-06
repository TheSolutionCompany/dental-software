import React, { useState } from "react"
import Modal from "react-modal"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

Modal.setAppElement("#root")

export const Register = () => {
    var q = query(collection(db, "Patients"))
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [patientsList, setPatientsList] = useState([])

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const handleQueryChange = async (event) => {
        event.preventDefault()
        setSearchQuery(event.target.value)

        if (searchQuery) {
            const start = searchQuery
            const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))

            q = query(q, where("name", ">=", start), where("name", "<", end))
            const result = (await getDocs(q)).docs.map((doc) => doc.data().name)
            setPatientsList(Object.values(result))
        } else {
            setPatientsList([])
        }
    }

    return (
        <div className="App">
            <button onClick={toggleModal}>Register</button>

            <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="Register">
                <div>
                    <label>Search Field:</label>
                    <input type="text" onChange={handleQueryChange} />
                </div>
                <button className="" onClick={toggleModal}>
                    Close
                </button>
                <ul>
                    {patientsList.map((patient) => (
                        <li>{patient}</li>
                    ))}
                </ul>
            </Modal>
        </div>
    )
}

export default Register
