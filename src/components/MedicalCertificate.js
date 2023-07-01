import React, { useEffect, useState, useRef } from "react"
import Modal from "react-modal"
import { useDatabase } from "../contexts/DatabaseContext"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useReactToPrint } from "react-to-print"

Modal.setAppElement("#root")

export const MedicalCertificate = () => {
    // Variables from DatabaseContext
    const { availableDoctors } = useDatabase()
    // Functions from DatabaseContext
    const { search, issueMc } = useDatabase()

    const toPrintRef = useRef()

    const [isOpen, setIsOpen] = useState(false)
    const [isInnerOpen, setIsInnerOpen] = useState(false)
    const [isInnerInnerOpen, setIsInnerInnerOpen] = useState(false)
    const [searchByName, setSearchByName] = useState("")
    const [searchByIc, setSearchByIc] = useState("")
    const [searchByMobileNumber, setsearchByMobileNumber] = useState("")
    const [patientsList, setPatientsList] = useState([])
    const [patientId, setPatientId] = useState("")
    const [patientName, setPatientName] = useState("")
    const [doctorId, setDoctorId] = useState("")
    const [doctorName, setDoctorName] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [remark, setRemark] = useState("")
    const [loading, setLoading] = useState(false)

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
            setPatientName("")
            setDoctorId("")
            setPatientId("")
            setDoctorName("")
        }
        setIsInnerOpen(!isInnerOpen)
    }

    const toggleInnerInnerModal = () => {
        if (isInnerInnerOpen) {
            setFromDate("")
            setToDate("")
            setRemark("")
        }
        setIsInnerInnerOpen(!isInnerInnerOpen)
    }

    const toUpperCase = (event) => {
        event.target.value = event.target.value.toUpperCase()
    }

    const handleSearchByName = (event) => {
        toUpperCase(event)
        setSearchByName(event.target.value)
    }

    const handleSearchByIC = (event) => {
        setSearchByIc(event.target.value)
    }

    const handlesearchByMobileNumber = (event) => {
        setsearchByMobileNumber(event.target.value)
    }

    const handleFromDate = (e) => {
        setFromDate(e.target.value)
    }

    const handleToDate = (e) => {
        setToDate(e.target.value)
    }

    const handleRemark = (e) => {
        setRemark(e.target.value)
    }

    const handleIssue = (patient) => {
        setPatientName(patient.data().name)
        setPatientId(patient.id)
        toggleInnerModal()
    }

    const handleSubmitMcDetails = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (fromDate <= toDate) {
            await issueMc(patientId, doctorId, fromDate, toDate, remark)
            const alertMcIssued = () =>
                toast.success("Medical Certificate Issued", {
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
            alertMcIssued()
            toggleInnerInnerModal()
        } else {
            const alertDateRange = () =>
                toast.error("Invalid date range", {
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
            alertDateRange()
        }
        setLoading(false)
    }

    const handlePrintMc = (e) => {
        e.preventDefault()
        toggleModal()
        toggleInnerModal()
        toggleInnerInnerModal()
    }

    const handlePrint = useReactToPrint({
        content: () => toPrintRef.current,
        documentTitle: { patientName },
    })

    return (
        <div className="App">
            <div className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Medical Certificate</span>
                </button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Register Existing"
                shouldCloseOnOverlayClick={false}
            >
                <CloseButton name="Medical Certificate" func={toggleModal} />
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
                            <input className="w-full" type="text" defaultValue={""} onChange={handleSearchByIC} />
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
                        <table className="w-full h-10 bg-gray-300 font-bold border border-black">
                            <tr className="w-full grid grid-cols-3 h-10 bg-gray-300 font-bold border-l border-t border-b border-black">
                                <th className="border-r border-black">Name</th>
                                <th className="border-r border-black">IC</th>
                                <th className="border-r border-black">Mobile Number</th>
                            </tr>
                        </table>
                    </div>
                    <div className="flex flex-col w-full h-fit mt-[-1px] overflow-auto">
                        <table>
                            {patientsList.map((patient) => (
                                <tr
                                    className="table-tr-tbody-gray hover:bg-green-400 cursor-pointer"
                                    key={patient.id}
                                    onClick={() => handleIssue(patient)}
                                >
                                    <td key={patient.data().name} className="border-r border-b border-black w-1/3">
                                        {patient.data().name}
                                    </td>
                                    <td key={patient.data().ic} className="border-r border-b border-black w-1/3">
                                        {patient.data().ic}
                                    </td>
                                    <td
                                        key={patient.data().mobileNumber}
                                        className="border-r border-b border-black w-1/3"
                                    >
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
                        <form className="flex flex-col" onSubmit={handleSubmitMcDetails}>
                            <div className="flex">
                                <p>Patient Name:</p>
                                <div className="font-semibold pl-2">{patientName}</div>
                            </div>
                            <label>From:</label>
                            <input
                                className="mb-8"
                                type="date"
                                placeholder="Starting Date"
                                onChange={handleFromDate}
                                required
                            />
                            <label>To:</label>
                            <input className="mb-8" type="date" onChange={handleToDate} required />
                            <label>Remark:</label>
                            <textarea
                                rows={4}
                                className="mb-8"
                                type="text"
                                id="remark"
                                onChange={handleRemark}
                                required
                            />
                            <label>Doctor:</label>
                            <select
                                className="select-dropdown"
                                onChange={(e) => {
                                    setDoctorId(e.target.value)
                                    setDoctorName(availableDoctors[e.target.selectedIndex - 1].data().displayName)
                                }}
                                required
                            >
                                <option disabled selected></option>
                                {availableDoctors.map((doctor) => (
                                    <option value={doctor.id}>{doctor.data().displayName}</option>
                                ))}
                            </select>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <button
                                    disabled={loading}
                                    style={{
                                        border: "1px solid black",
                                        borderRadius: "5px",
                                        backgroundColor: "lightgray",
                                        width: "120px",
                                        height: "40px",
                                    }}
                                    type="submit"
                                >
                                    Issue MC
                                </button>
                            </div>
                        </form>
                        <Modal
                            isOpen={isInnerInnerOpen}
                            onRequestClose={toggleInnerInnerModal}
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
                                    top: "50px",
                                    left: "300px",
                                    right: "300px",
                                    bottom: "50px",
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
                            <CloseButton
                                name="Preview"
                                func={() => {
                                    toggleInnerInnerModal()
                                    toggleInnerModal()
                                }}
                            />
                            <form className="border border-black p-5" onSubmit={handlePrintMc}>
                                <div ref={toPrintRef}>
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-align-center font-bold">Medical Certificate</p>
                                        <br />
                                        <p className="text-align-center font-bold">Klinik Pergigian Sunlightdental</p>
                                        <p className="text-align-center">No. 87 (GF), Jalan Anggerik Emas 1.</p>
                                        <p className="text-align-center">Taman Anggerik Emas,</p>
                                        <p className="text-align-center">81200 Johor Bahru</p>
                                        <p className="text-align-center">019-9468987</p>
                                    </div>
                                    <br />
                                    <div className="flex flex-row justify-between">
                                        <div>Date: {fromDate}</div>
                                        <div>Ref no:</div>
                                    </div>
                                    <br />
                                    <p className="font-bold">{patientName}</p>
                                    <br />
                                    <p>
                                        This is to certified that{" "}
                                        <span className="underline">
                                            Dr {doctorName}({doctorId})
                                        </span>{" "}
                                        has examined me on <span className="underline">{fromDate}</span>
                                    </p>
                                    <br />
                                    <p>
                                        Due to his/her illness, he/she has been advised to stay off work from{" "}
                                        <span className="underline">{fromDate}</span> to{" "}
                                        <span className="underline">{toDate}</span>
                                    </p>
                                    <br />
                                    <p>
                                        <span className="font-bold">Remark:</span>{" "}
                                        <span className="italic">{remark}</span>{" "}
                                    </p>
                                    <br />
                                    <br />
                                    <br />
                                    <p className="font-bold" style={{ fontSize: "13px" }}>
                                        Dr {doctorName}
                                    </p>
                                    <br />
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-align-center">----------Printed: {fromDate}----------</p>
                                        <p className="text-align-center">Thank you</p>
                                    </div>
                                </div>
                            </form>
                            <br />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <button
                                    style={{
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                        border: "1px solid black",
                                        backgroundColor: "lightgray",
                                        width: "100px",
                                        height: "30px",
                                    }}
                                    onClick={handlePrint}
                                >
                                    Print
                                </button>
                            </div>
                        </Modal>
                    </Modal>
                </div>
            </Modal>
            <ToastContainer limit={1} />
        </div>
    )
}

export default MedicalCertificate
