import React, { useEffect, useState } from "react"
import { db } from "../firebase"
import { useLocation, useNavigate } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import CloseButton from "../components/CloseButton"

const PatientProfile = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { patientId, doctorId } = state
    const [title, setTitle] = useState("")
    const [name, setName] = useState("")
    const [IC, setIC] = useState("")
    const [gender, setGender] = useState("")
    const [DOB, setDOB] = useState("")
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

    useEffect(() => {
        const q = doc(db, "patients", patientId)
        getDoc(q).then((doc) => {
            setTitle(doc.data().title)
            setName(doc.data().name)
            setIC(doc.data().IC)
            setGender(doc.data().gender)
            setDOB(doc.data().DOB)
            setAge(doc.data().age)
            setMobileNumber(doc.data().mobileNumber)
            setPhoneNumber(doc.data().phoneNumber)
            setEmail(doc.data().email)
            setRace(doc.data.race)
        })

    }, [])

    const handleBackToQueue = () => {
        navigate("/Queue")
    }

    return (
        <React.Fragment>
            <CloseButton func={handleBackToQueue}/>
            <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col">
                    <label>Title</label>
                    <select value={title} className="select-dropdown" onChange={(e) => setTitle(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Name *</label>
                    <input
                        type="text"
                        defaultValue={name}
                        onChange={(e) => {
                            e.target.value = e.target.value.toUpperCase()
                            setName(e.target.value)
                        }}
                        required
                        autoFocus
                    />
                </div>
                <div className="flex flex-col">
                    <label>IC/Passport number *</label>
                    <input type="text" defaultValue={IC} onChange={(e) => setIC(e.target.value)} required />
                </div>
                <div className="flex flex-col">
                    <label>Gender</label>
                    <select value={gender} className="select-dropdown" onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>DOB *</label>
                    <input id="dob" defaultValue={DOB} type="date" onChange={(e) => setDOB(e.target.value)} required />
                </div>
                <div className="flex flex-col">
                    <label>Age *</label>
                    <input id="age" defaultValue={age} type="text" onChange={(e) => setAge(e.target.value)} required />
                </div>
                <div className="flex flex-col">
                    <label>Mobile number</label>
                    <input type="tel" defaultValue={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Phone number</label>
                    <input type="tel" defaultValue={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Race</label>
                    <select value={race} className="select-dropdown" onChange={(e) => setRace(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Malay">Malay</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Indian">Indian</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Marital status</label>
                    <select value={maritalStatus} className="select-dropdown" onChange={(e) => setMaritalStatus(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Nationality</label>
                    <select value={nationality} className="select-dropdown" onChange={(e) => setNationality(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Malaysian">Malaysian</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Emergency contact name</label>
                    <input type="text" defaultValue={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Emergency contact number</label>
                    <input type="tel" defaultValue={emergencyContactNumber} onChange={(e) => setEmergencyContactNumber(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Blood type</label>
                    <select value={bloodType} className="select-dropdown" onChange={(e) => setBloodType(e.target.value)}>
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Know about us</label>
                    <select value={knowAboutUs} className="select-dropdown" onChange={(e) => setKnowAboutUs(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Google">Google</option>
                        <option value="Friends">Friends</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Panel company</label>
                    <select value={panelCompany} className="select-dropdown" onChange={(e) => setPanelCompany(e.target.value)}>
                        <option value="">Select</option>
                        <option value="AIA">AIA</option>
                        <option value="Allianz">Allianz</option>
                        <option value="AXA">AXA</option>
                        <option value="Great Eastern">Great Eastern</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Occupation</label>
                    <input type="text" defaultValue={occupation} onChange={(e) => setOccupation(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Preferred language</label>
                    <select value={preferredLanguage} className="select-dropdown" onChange={(e) => setPreferredLanguage(e.target.value)}>
                        <option value="">Select</option>
                        <option value="English">English</option>
                        <option value="Malay">Malay</option>
                        <option value="Chinese">Chinese</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Preferred communication</label>
                    <select value={preferredCommunication} className="select-dropdown" onChange={(e) => setPreferredCommunication(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Email">Email</option>
                        <option value="SMS">SMS</option>
                        <option value="WhatsApp">WhatsApp</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label>Refer by</label>
                    <input type="text" defaultValue={referBy} onChange={(e) => setReferBy(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Address</label>
                    <textarea defaultValue={address} rows={4} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Second address</label>
                    <textarea defaultValue={secondAddress} rows={4} onChange={(e) => setSecondAddress(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Allergy/Medical history</label>
                    <textarea defaultValue={allergy} rows={4} onChange={(e) => setAllergy(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label>Remark</label>
                    <textarea defaultValue={remark} rows={4} onChange={(e) => setRemark(e.target.value)} />
                </div>
            </div>
        </React.Fragment>
    )
}

export default PatientProfile
