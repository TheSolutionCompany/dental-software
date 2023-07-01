import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import { useDatabase } from "../contexts/DatabaseContext"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

export const RegisterExisting = () => {
    // Variables from DatabaseContext
    const { availableDoctors } = useDatabase()
    // Functions from DatabaseContext
    const { search, addToQueue } = useDatabase()

    const [isOpen, setIsOpen] = useState(false)
    const [isInnerOpen, setIsInnerOpen] = useState(false)
    const [searchByName, setSearchByName] = useState("")
    const [searchByIc, setSearchByIc] = useState("")
    const [searchByMobileNumber, setsearchByMobileNumber] = useState("")
    const [patientsList, setPatientsList] = useState([])
    const [patientName, setPatientName] = useState("")
    const [gender, setGender] = useState("")
    const [age, setAge] = useState("")
    const [ic, setIc] = useState("")
    const [patientId, setPatientId] = useState("")
    const [complains, setComplains] = useState("")
    const [doctorId, setDoctorId] = useState("")

    const [addToQueueSuccess, setAddToQueueSuccess] = useState(false)

    useEffect(() => {
        search(searchByName, searchByIc, searchByMobileNumber).then((result) => {
            setPatientsList(result)
        })
    }, [searchByName, searchByIc, searchByMobileNumber])

    const toggleModal = () => {
        if (isOpen) {
            setPatientsList([])
            setSearchByName("")
            setSearchByIc("")
            setsearchByMobileNumber("")
        }
        setIsOpen(!isOpen)
    }

    const toggleInnerModal = () => {
        if (isInnerOpen) {
            setPatientId("")
            setPatientName("")
            setComplains("")
            setDoctorId("")
            setAge("")
            setIc("")
            setGender("")
        }
        setIsInnerOpen(!isInnerOpen)
    }

    const toUpperCase = (event) => {
        event.target.value = event.target.value.toUpperCase()
    }

    const handleSearchByName = (event) => {
        toUpperCase(event)
        setSearchByName(event.target.value)
    }

    const handleSearchByIc = (event) => {
        setSearchByIc(event.target.value)
    }

    const handlesearchByMobileNumber = (event) => {
        setsearchByMobileNumber(event.target.value)
    }

    const handleRegister = (patient) => {
        setPatientId(patient.id)
        setPatientName(patient.data().name)
        setGender(patient.data().gender)
        setAge(patient.data().age)
        setIc(patient.data().ic)
        toggleInnerModal()
    }

    const handleAddToQueue = async (e) => {
        e.preventDefault()
        setAddToQueueSuccess(true)
        await addToQueue(patientId, patientName, age, ic, gender, doctorId, complains, "waiting")
        const alertAddToQueueSuccess = () =>
            toast.success("Added to queue successfully", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        toast.dismiss()
        toast.clearWaitingQueue()
        alertAddToQueueSuccess()
        toggleInnerModal()
        toggleModal()
        setAddToQueueSuccess(false)
    }

    return (
        <div className="App">
            <div className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Register Existing</span>
                </button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Register Existing"
                shouldCloseOnOverlayClick={false}
            >
                <CloseButton name="Register Existing" func={toggleModal} />
                <div className="w-full">
                    <div className="w-full grid grid-cols-3 h-full gap-4 pb-6">
                        <div className="">
                            <label>Search By Name:</label>
                            <input
                                className="w-full"
                                type="text"
                                defaultValue={""}
                                onChange={handleSearchByName}
                                autoFocus
                            />
                        </div>
                        <div className="">
                            <label>Search By IC:</label>
                            <input className="w-full" type="text" defaultValue={""} onChange={handleSearchByIc} />
                        </div>
                        <div className="">
                            <label>Search By Mobile Number:</label>
                            <input
                                className="w-full"
                                type="text"
                                defaultValue={""}
                                onChange={handlesearchByMobileNumber}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <table className="table-gray">
                            <tr className="table-tr-thead-gray border-black">
                                <th className="table-th-gray w-1/3">Name</th>
                                <th className="table-th-gray w-1/3">IC</th>
                                <th className="table-th-gray w-1/3">Mobile Number</th>
                            </tr>
                        </table>
                    </div>
                    <div className="flex flex-col w-full h-fit mt-[-1px] overflow-auto">
                        <table>
                            {patientsList.map((patient) => (
                                <tr
                                    className="table-tr-tbody-gray hover:bg-green-400 cursor-pointer"
                                    key={patient.id}
                                    onClick={() => handleRegister(patient)}
                                >
                                    <td className="border-r border-b border-black w-1/3">{patient.data().name}</td>
                                    <td className="border-r border-b border-black w-1/3">{patient.data().ic}</td>
                                    <td className="border-r border-b border-black w-1/3">
                                        {patient.data().mobileNumber}
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>

                    <Modal
                        isOpen={isInnerOpen}
                        onRequestClose={toggleInnerModal}
                        contentLabel="Add To Queue"
                        shouldCloseOnOverlayClick={false}
                        style={{
                            overlay: {
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(255, 255, 255, 0.75)",
                            },
                            content: {
                                position: "absolute",
                                top: "100px",
                                left: "500px",
                                right: "500px",
                                bottom: "100px",
                                border: "1px solid #ccc",
                                background: "#fff",
                                overflow: "auto",
                                WebkitOverflowScrolling: "touch",
                                borderRadius: "4px",
                                outline: "none",
                                padding: "20px",
                            },
                        }}
                    >
                        <CloseButton func={toggleInnerModal} />
                        <form onSubmit={handleAddToQueue}>
                            <div className="flex">
                                <p>Patient Name:</p>
                                <div className="font-semibold pl-2">{patientName}</div>
                            </div>
                            <div className="flex flex-col">
                                <p>Complains:</p>
                                <textarea rows={4} onChange={(e) => setComplains(e.target.value)} />
                                <p>Doctor:</p>
                                <select
                                    className="select-dropdown"
                                    onChange={(e) => setDoctorId(e.target.value)}
                                    required
                                >
                                    <option disabled selected></option>
                                    {availableDoctors.map((doctor) => (
                                        <option value={doctor.id}>{doctor.data().displayName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-center pt-4">
                                <button disabled={addToQueueSuccess} className="button-green rounded" type="submit">
                                    Add To Queue
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </Modal>
            <ToastContainer limit={1} />
        </div>
    )
}

export default RegisterExisting
