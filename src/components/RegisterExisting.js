import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

Modal.setAppElement("#root")

export const RegisterExisting = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [patientsList, setPatientsList] = useState([])

    useEffect(() => {
        const handleSearch = async () => {
            if (searchQuery) {
                const start = searchQuery
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(collection(db, "Patients"), where("name", ">=", start), where("name", "<", end))
                const result = (await getDocs(q)).docs.map((doc) => doc.data().name)
                setPatientsList(Object.values(result.sort()))
            } else {
                setPatientsList([])
            }
        }

        handleSearch()
    }, [searchQuery])

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const handleQueryChange = async (event) => {
        setSearchQuery(event.target.value)
    }

    return (
        <div className="App">
            <li className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    class="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span class="text-left flex-1 ml-3 whitespace-nowrap">Register Existing</span>
                    {/* <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                Pro
                            </span> */}
                </button>
            </li>
            <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="Register">
                <div>
                    <label>Search Field:</label>
                    <input type="text" defaultValue={""} onChange={handleQueryChange} />
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

export default RegisterExisting
