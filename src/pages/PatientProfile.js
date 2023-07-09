import React, { useEffect, useState } from "react"
import { db } from "../firebase"
import { useLocation, useNavigate } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import Header from "../components/Header"
import SideBar from "../components/SideBar"
import ConsultationForm from "../components/ConsultationForm"
import { useAuth } from "../contexts/AuthContext"
import { useDatabase } from "../contexts/DatabaseContext"

const PatientProfile = () => {
    // Variables from AuthContext
    const { logout } = useAuth()

    // Functions from DatabaseContext
    const { getConsultationHistory } = useDatabase()

    const navigate = useNavigate()

    const { state } = useLocation()
    const { patientId, mode, queueId } = state

    const [title, setTitle] = useState("")
    const [name, setName] = useState("")
    const [ic, setIc] = useState("")
    const [gender, setGender] = useState("")
    const [dob, setDob] = useState("")
    const [age, setAge] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState("")
    const [race, setRace] = useState("")
    const [maritalStatus, setMaritalStatus] = useState("")
    const [nationality, setNationality] = useState("")
    const [emergencyContactName, setEmergencyContactName] = useState("")
    const [emergencyContactNumber, setEmergencyContactNumber] = useState("")
    const [bloodType, setBloodType] = useState("")
    const [knowAboutUs, setKnowAboutUs] = useState("")
    const [panelCompany, setPanelCompany] = useState("")
    const [occupation, setOccupation] = useState("")
    const [preferredLanguage, setPreferredLanguage] = useState("")
    const [preferredCommunication, setPreferredCommunication] = useState("")
    const [referBy, setReferBy] = useState("")
    const [address, setAddress] = useState("")
    const [secondAddress, setSecondAddress] = useState("")
    const [allergy, setAllergy] = useState("")
    const [remark, setRemark] = useState("")

    const [page, setPage] = useState("consultation")
    const [requireUpdate, setRequireUpdate] = useState(false)
    const [consultationHistory, setConsultationHistory] = useState([])

    async function handleLogout() {
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (requireUpdate) {
            getConsultationHistory(patientId, queueId).then((result) => {
                setConsultationHistory(result)
            })
            setRequireUpdate(false)
        }
    }, [requireUpdate])

    function setUpdate(e) {
        setRequireUpdate(e)
    }

    useEffect(() => {
        const q = doc(db, "patients", patientId)
        getDoc(q).then((doc) => {
            setTitle(doc.data().title)
            setName(doc.data().name)
            setIc(doc.data().ic)
            setGender(doc.data().gender)
            setDob(doc.data().dob)
            setAge(doc.data().age)
            setMobileNumber(doc.data().mobileNumber)
            setPhoneNumber(doc.data().phoneNumber)
            setEmail(doc.data().email)
            setRace(doc.data.race)
            setMaritalStatus(doc.data().maritalStatus)
            setNationality(doc.data().nationality)
            setEmergencyContactName(doc.data().emergencyContactName)
            setEmergencyContactNumber(doc.data().emergencyContactNumber)
            setBloodType(doc.data().bloodType)
            setKnowAboutUs(doc.data().knowAboutUs)
            setPanelCompany(doc.data().panelCompany)
            setOccupation(doc.data().occupation)
            setPreferredLanguage(doc.data().preferredLanguage)
            setPreferredCommunication(doc.data().preferredCommunication)
            setReferBy(doc.data().referBy)
            setAddress(doc.data().address)
            setSecondAddress(doc.data().secondAddress)
            setAllergy(doc.data().allergy)
            setRemark(doc.data().remark)
        })
        getConsultationHistory(patientId, queueId).then((result) => {
            setConsultationHistory(result)
        })
    }, [patientId])

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"PatientProfile"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200 h-full">
                    <div className="flex flex-row px-8 pb-4 pt-8 text-left">
                        <p className="px-2 border border-black">
                            Patient name: <br></br> <b>{name}</b>
                        </p>
                        <p className="px-2 border border-black">
                            IC: <br></br> <b>{ic}</b>
                        </p>
                        <p className="px-2 border border-black">
                            Gender: <br></br> <b>{gender}</b>
                        </p>
                        <p className="px-2 border border-black">
                            DOB: <br></br> <b>{dob}</b>
                        </p>
                        <p className="px-2 border border-black">
                            Age: <br></br> <b>{age}</b>
                        </p>
                        <p className="px-2 border border-black">
                            Mobile number: <br></br> <b>{mobileNumber}</b>
                        </p>
                    </div>
                    <div className="flex flex-row pb-4 px-8">
                        <button
                            className={`border border-black p-2
                            ${page 
                                === "consultation" 
                                ? "bg-blue-300"
                                : "bg-white" }`}
                            type="button"
                            hidden={mode === "view"}
                            onClick={(e) => setPage("consultation")}
                        >
                            Current Consultation
                        </button>
                        <button
                            className={`border border-black p-2
                            ${page 
                                === "history"
                                ? "bg-blue-300"
                                : "bg-white" }`}
                            type="button"
                            onClick={(e) => setPage("history")}
                        >
                            Consultation History
                        </button>
                    </div>
                    {mode === "consult" && page === "consultation" && (
                        <ConsultationForm patientId={patientId} queueId={queueId} setRequireUpdate={setUpdate} />
                    )}
                    {page === "history" && (
                        <div className="flex flex-col overflow-auto h-3/4 mx-8">
                            {consultationHistory.map((consultation) => (
                                <div className="flex flex-col">
                                    <p className="text-left pl-2">
                                        Date: {new Date(consultation.data().creationDate).toDateString()}
                                    </p>
                                    <div className="border-black border p-2 mb-4 flex flex-row bg-white">
                                        <div className="w-3/5 flex flex-row">
                                            <div className="w-1/3 pr-2 flex flex-col">
                                                <p className="text-left">Complains:</p>
                                                <div className="w-full h-full pr-2 border border-black bg-gray-100 text-left p-2">
                                                    {consultation.data().complains}
                                                </div>
                                            </div>
                                            <div className="w-1/3 pr-2 flex flex-col">
                                                <p className="text-left">Consultation:</p>
                                                <div className="w-full h-full pr-2 border border-black bg-gray-100 text-left p-2">
                                                    {consultation.data().consultation}
                                                </div>
                                            </div>
                                            <div className="w-1/3 pr-2 flex flex-col">
                                                <p className="text-left">Frontdesk Message:</p>
                                                <div className="w-full h-full pr-2 border border-black bg-gray-100 text-left p-2">
                                                    {consultation.data().frontDeskMessage}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-2/5 flex flex-col">
                                            <p className="text-left">Items:</p>
                                            <table className="table-gray">
                                                <thead>
                                                    <tr>
                                                        <th className="w-[49%]">Item</th>
                                                        <th className="w-[17%]">Price</th>
                                                        <th className="w-[17%]">Quantity</th>
                                                        <th className="w-[17%]">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {consultation.data().items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.name}</td>
                                                            <td>{item.unitPrice}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.subtotal}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="3">Grand Total</td>
                                                        <td>{consultation.data().grandTotal}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PatientProfile
