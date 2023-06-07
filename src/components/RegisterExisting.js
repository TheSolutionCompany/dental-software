import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

Modal.setAppElement("#root")

export const RegisterExisting = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchByName, setSearchByName] = useState("")
    const [searchByIC, setSearchByIC] = useState("")
    const [searchByPhone, setSearchByPhone] = useState("")
    const [patientsList, setPatientsList] = useState([])

    useEffect(() => {
        const handleSearch = async () => {
            if (searchByName) {
                const start = searchByName
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(collection(db, "patients"), where("name", ">=", start), where("name", "<", end))
                const result = (await getDocs(q)).docs.map((doc) => [
                    doc.data().name,
                    doc.data().IC,
                    doc.data().phoneNumber,
                ])
                setPatientsList(Object.values(result.sort()))
            } else if (searchByIC) {
                const start = searchByIC
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(collection(db, "patients"), where("IC", ">=", start), where("IC", "<", end))
                const result = (await getDocs(q)).docs.map((doc) => [
                    doc.data().name,
                    doc.data().IC,
                    doc.data().phoneNumber,
                ])
                setPatientsList(Object.values(result.sort()))
            } else if (searchByPhone) {
                const start = searchByPhone
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(
                    collection(db, "patients"),
                    where("phoneNumber", ">=", start),
                    where("phoneNumber", "<", end)
                )
                const result = (await getDocs(q)).docs.map((doc) => [
                    doc.data().name,
                    doc.data().IC,
                    doc.data().phoneNumber,
                ])
                setPatientsList(Object.values(result.sort()))
            } else {
                setPatientsList([])
            }
        }
        handleSearch()
    }, [searchByName, searchByIC, searchByPhone])

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const toUpperCase = (event) => {
        event.target.value = event.target.value.toUpperCase()
    }

    const handleSearchByName = (event) => {
        toUpperCase(event)
        setSearchByName(event.target.value)
    }

    const handleSearchByIC = (event) => {
        setSearchByIC(event.target.value)
    }

    const handleSearchByPhone = (event) => {
        setSearchByPhone(event.target.value)
    }

    return (
        <div className="App">
            <li className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    class="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <svg
                        aria-hidden="true"
                        class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                    <span class="text-left flex-1 ml-3 whitespace-nowrap">Register Existing</span>
                    {/* <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                Pro
                            </span> */}
                </button>
            </li>
            <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="Register">
                <div>
                    <label>Search By Name:</label>
                    <input type="text" defaultValue={""} onChange={handleSearchByName} />
                </div>
                <div>
                    <label>Search By IC:</label>
                    <input type="text" defaultValue={""} onChange={handleSearchByIC} />
                </div>
                <div>
                    <label>Search By Phone Number:</label>
                    <input type="text" defaultValue={""} onChange={handleSearchByPhone} />
                </div>
                <button className="" onClick={toggleModal}>
                    Close
                </button>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>IC</th>
                        <th>Phone Number</th>
                    </tr>
                    {patientsList.map((patient) => (
                        <tr>
                            <td>{patient[0]}</td>
                            <td>{patient[1]}</td>
                            <td>{patient[2]}</td>
                        </tr>
                    ))}
                </table>
                {/* <ul>
                    {patientsList.map((patient) => (
                        <li>{patient}</li>
                    ))}
                </ul> */}
            </Modal>
        </div>
    )
}

export default RegisterExisting
