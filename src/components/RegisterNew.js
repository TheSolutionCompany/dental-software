import React from "react"
import { useState } from "react"
import { db } from "../firebase"
import { collection, addDoc } from "firebase/firestore"
import Modal from "react-modal"

Modal.setAppElement("#root")

const RegisterNew = () => {
    const [isCreate, setIsCreate] = useState("Create")
    const [isOpen, setIsOpen] = useState(false)
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
    const [allegy, setAllegy] = useState("")
    const [remark, setRemark] = useState("")

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const handleCreate = async (event) => {
        event.preventDefault()
        if (isCreate === "Create") {
            await addDoc(collection(db, "patients"), {
                title: title,
                name: name,
                IC: IC,
                gender: gender,
                DOB: DOB,
                age: age,
                mobileNumber: mobileNumber,
                phoneNumber: phoneNumber,
                email: email,
                race: race,
                maritalStatus: maritalStatus,
                nationality: nationality,
                emergencyContactName: emergencyContactName,
                emergencyContactNumber: emergencyContactNumber,
                bloodType: bloodType,
                knowAboutUs: knowAboutUs,
                panelCompany: panelCompany,
                occupation: occupation,
                preferredLanguage: preferredLanguage,
                preferredCommunication: preferredCommunication,
                referBy: referBy,
                address: address,
                secondAddress: secondAddress,
                allegy: allegy,
                remark: remark,
            })
            setIsCreate("Created")
        } else {
            alert("The patient has been created")
        }
    }

    const handleSendToQueue = (event) => {
        event.preventDefault()
        if (isCreate === "Create") {
            alert("Please create the patient first")
        }
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
                    <span class="text-left flex-1 ml-3 whitespace-nowrap">Register New</span>
                    {/* <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                Pro
                            </span> */}
                </button>
            </li>
            <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="Register">
                <form onSubmit={handleCreate}>
                    <div>
                        <label>Title</label>
                        <select size="5" onChange={(e) => setTitle(e.target.value)}>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Miss">Miss</option>
                            <option value="Dr">Dr</option>
                        </select>
                    </div>
                    <div>
                        <label>Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label>IC/Passport number</label>
                        <input type="text" onChange={(e) => setIC(e.target.value)} required />
                    </div>
                    <div>
                        <label>Gender</label>
                        <select size="3" onChange={(e) => setGender(e.target.value)}>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Others</option>
                        </select>
                    </div>
                    <div>
                        <label>DOB</label>
                        <input type="date" onChange={(e) => setDOB(e.target.value)} required />
                    </div>
                    <div>
                        <label>Age</label>
                        <input type="number" onChange={(e) => setAge(e.target.value)} required />
                    </div>
                    <div>
                        <label>Mobile number</label>
                        <input type="tel" onChange={(e) => setMobileNumber(e.target.value)} />
                    </div>
                    <div>
                        <label>Phone number</label>
                        <input type="tel" onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Race</label>
                        <select size="4" onChange={(e) => setRace(e.target.value)}>
                            <option value="Malay">Malay</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Indian">Indian</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div>
                        <label>Marital status</label>
                        <select size="4" onChange={(e) => setMaritalStatus(e.target.value)}>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>
                    <div>
                        <label>Nationality</label>
                        <select size="2" onChange={(e) => setNationality(e.target.value)}>
                            <option value="Malaysian">Malaysian</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div>
                        <label>Emergency contact name</label>
                        <input type="text" onChange={(e) => setEmergencyContactName(e.target.value)} />
                    </div>
                    <div>
                        <label>Emergency contact number</label>
                        <input type="tel" onChange={(e) => setEmergencyContactNumber(e.target.value)} />
                    </div>
                    <div>
                        <label>Blood type</label>
                        <select size="8" onChange={(e) => setBloodType(e.target.value)}>
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
                    <div>
                        <label>Know about us</label>
                        <select size="4" onChange={(e) => setKnowAboutUs(e.target.value)}>
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Google">Google</option>
                            <option value="Friends">Friends</option>
                        </select>
                    </div>
                    <div>
                        <label>Panel company</label>
                        <select size="4" onChange={(e) => setPanelCompany(e.target.value)}>
                            <option value="AIA">AIA</option>
                            <option value="Allianz">Allianz</option>
                            <option value="AXA">AXA</option>
                            <option value="Great Eastern">Great Eastern</option>
                        </select>
                    </div>
                    <div>
                        <label>Occupation</label>
                        <input type="text" onChange={(e) => setOccupation(e.target.value)} />
                    </div>
                    <div>
                        <label>Preferred language</label>
                        <select size="3" onChange={(e) => setPreferredLanguage(e.target.value)}>
                            <option value="English">English</option>
                            <option value="Malay">Malay</option>
                            <option value="Chinese">Chinese</option>
                        </select>
                    </div>
                    <div>
                        <label>Preferred communication</label>
                        <select size="3" onChange={(e) => setPreferredCommunication(e.target.value)}>
                            <option value="Email">Email</option>
                            <option value="SMS">SMS</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>
                    </div>
                    <div>
                        <label>Refer by</label>
                        <input type="text" onChange={(e) => setReferBy(e.target.value)} />
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div>
                        <label>Second address</label>
                        <input type="text" onChange={(e) => setSecondAddress(e.target.value)} />
                    </div>
                    <div>
                        <label>Allegy/Medical history</label>
                        <input type="text" onChange={(e) => setAllegy(e.target.value)} />
                    </div>
                    <div>
                        <label>Remark</label>
                        <input type="text" onChange={(e) => setRemark(e.target.value)} />
                    </div>
                    <div>
                        <button type="submit">
                            Create
                        </button>
                    </div>
                </form>
                <div>
                    <button type="button" onClick={handleSendToQueue}>
                        Send to queue
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default RegisterNew
