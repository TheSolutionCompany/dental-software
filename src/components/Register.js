import React, { useState } from "react"
import Modal from "react-modal"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

Modal.setAppElement("#root");

export const Register = () => {
    var q = query(collection(db, "Patients"))
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [patientsList, setPatientsList] = useState([])

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

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
            <li className="cursor-pointer select-none">
                <button  
                    onClick={toggleModal}
                    class="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg
                        aria-hidden="true"
                        class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                    <span class="text-left flex-1 ml-3 whitespace-nowrap">
                        Register
                    </span>
                    {/* <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                Pro
                            </span> */}
                </button>
            </li>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Register"
            >
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
    );
};

export default Register;
