import React, { useState } from "react"
import Modal from "react-modal"

Modal.setAppElement("#root")

export const Register = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const handleQueryChange = (event) => {
        setSearchQuery(event.target.value)
        console.log(searchQuery)
    }

    return (
        <div className="App">
            <button onClick={toggleModal}>Register</button>

            <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="Register">
                <div>
                    <label>Search Field:</label>
                    <input type="text" onChange={handleQueryChange} />
                </div>
                <button onClick={toggleModal}>Close modal</button>
            </Modal>
        </div>
    )
}

export default Register
