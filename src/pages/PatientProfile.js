import React, { useEffect, useState } from "react"
import { db } from "../firebase"
import { useLocation, useNavigate } from "react-router-dom"
import { getDoc, doc, collection } from "firebase/firestore"
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
    const { patientId, mode , queueId} = state

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
                <div className="w-full bg-gray-200 p-4">
                    <div className="flex flex-row pb-4">
                        <p className="pr-2">
                            Patient name: <b>{name}</b>
                        </p>
                        <p className="pr-2">
                            IC: <b>{ic}</b>
                        </p>
                        <p className="pr-2">
                            Gender: <b>{gender}</b>
                        </p>
                        <p className="pr-2">
                            DOB: <b>{dob}</b>
                        </p>
                        <p className="pr-2">
                            Age: <b>{age}</b>
                        </p>
                        <p className="pr-2">
                            Mobile number: <b>{mobileNumber}</b>
                        </p>
                    </div>
                    <div>
                        <button type="button" hidden={mode === "view"} onClick={(e) => setPage("consultation")}>
                            Current Consultation
                        </button>
                        <button type="button" onClick={(e) => setPage("history")}>
                            Consultation History
                        </button>
                    </div>
                    {mode === "consult" && page === "consultation" && <ConsultationForm patientId={patientId} queueId={queueId}/>}
                    {page === "history" && (
                        <div>
                            {consultationHistory.map((consultation) => (
                                <p>{consultation.data().consultation}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PatientProfile
