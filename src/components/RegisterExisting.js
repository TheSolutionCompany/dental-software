import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import { db } from "../firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import CloseButton from "./CloseButton"

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
                const result = (await getDocs(q)).docs.map((doc) => doc)
                setPatientsList(Object.values(result.sort()))
            } else if (searchByIC) {
                const start = searchByIC
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(collection(db, "patients"), where("IC", ">=", start), where("IC", "<", end))
                const result = (await getDocs(q)).docs.map((doc) => doc)
                setPatientsList(Object.values(result.sort()))
            } else if (searchByPhone) {
                const start = searchByPhone
                const end = start.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
                const q = query(
                    collection(db, "patients"),
                    where("phoneNumber", ">=", start),
                    where("phoneNumber", "<", end)
                )
                const result = (await getDocs(q)).docs.map((doc) => doc)
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

    const handleRegister = (patient) => {
        alert(patient.id)
    }

    return (
        <div className="App">
            <li className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Register Existing</span>
                    {/* <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                Pro
                            </span> */}
                </button>
            </li>
            <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="Register" shouldCloseOnOverlayClick={false}>
                <CloseButton toggleModal={toggleModal} />
                <div className="relative">
                    <div className="w-full grid grid-cols-3 h-full gap-4 pb-6">
                        <div className="">
                            <label>Search By Name:</label>
                            <input
                                className="w-full"
                                type="text"
                                defaultValue={""}
                                onChange={handleSearchByName}
                                autofocus
                            />
                        </div>
                        <div className="">
                            <label>Search By IC:</label>
                            <input className="w-full" type="text" defaultValue={""} onChange={handleSearchByIC} />
                        </div>
                        <div className="">
                            <label>Search By Phone Number:</label>
                            <input className="w-full" type="text" defaultValue={""} onChange={handleSearchByPhone} />
                        </div>
                    </div>
                    <table className="w-full grid grid-cols-3 h-10 bg-gray-300 font-bold border-l border-t border-b border-black">
                        <tr className="w-full grid grid-cols-3 h-10 bg-gray-300 font-bold border-l border-t border-b border-black">
                            <th className="border-r border-black">Name</th>
                            <th className="border-r border-black">IC</th>
                            <th className="border-r border-black">Phone Number</th>
                        </tr>
                        {patientsList.map((patient) => (
                            <tr
                                className="w-full grid grid-cols-3 h-10 bg-gray-400 font-semibold border-l border-black"
                                key={patient.id} onClick={() => handleRegister(patient)}
                            >
                                <td className="border-r border-b border-black">{patient.data().name}</td>
                                <td className="border-r border-b border-black">{patient.data().IC}</td>
                                <td className="border-r border-b border-black">{patient.data().phoneNumber}</td>
                            </tr>
                        ))}
                    </table>
                </div>
            </Modal>
        </div>
    )
}

export default RegisterExisting
