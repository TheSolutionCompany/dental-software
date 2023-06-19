import React, { useEffect } from "react"
import { useState } from "react"
import { db } from "../firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"
import Modal from "react-modal"
import CloseButton from "./CloseButton"

Modal.setAppElement("#root")

const RegisterNew = () => {
    const [isCreate, setIsCreate] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isInnerOpen, setIsInnerOpen] = useState(false)
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

    const [patientId, setPatientId] = useState("")
    const [complains, setComplains] = useState("")
    const [doctorId, setDoctorId] = useState("")

    const toggleModal = () => {
        if (isOpen) {
            setIsCreate(false)
            setTitle("")
            setName("")
            setIC("")
            setGender("")
            setDOB("")
            setAge("")
            setMobileNumber("")
            setPhoneNumber("")
            setEmail("")
            setRace("")
            setMaritalStatus("")
            setNationality("")
            setEmergencyContactName("")
            setEmergencyContactNumber("")
            setBloodType("")
            setKnowAboutUs("")
            setPanelCompany("")
            setOccupation("")
            setPreferredLanguage("")
            setPreferredCommunication("")
            setReferBy("")
            setAddress("")
            setSecondAddress("")
            setAllergy("")
            setRemark("")
        }
        setIsOpen(!isOpen)
    }

    const toggleInnerModal = () => {
        if (isInnerOpen) {
            setPatientId("")
            setComplains("")
            setDoctorId("")
        }
        setIsInnerOpen(!isInnerOpen)
    }

    useEffect(() => {
        if (isCreate) {
            document.getElementById("createButton").hidden = true
            document.getElementById("sendToQueueButton").hidden = false
        }
    }, [isCreate])

    useEffect(() => {
        if (IC.length === 12) {
            let a
            let dob
            const year = IC.slice(0, 2)
            const month = IC.slice(2, 4)
            const day = IC.slice(4, 6)
            const currentYear = new Date().getFullYear().toString().slice(2, 4)
            if (year <= currentYear) {
                a = currentYear - year
                dob = "20" + year + "-" + month + "-" + day
            } else {
                a = currentYear - year + 100
                dob = "19" + year + "-" + month + "-" + day
            }
            document.getElementById("age").value = a
            document.getElementById("dob").value = dob
            setAge(a)
            setDOB(dob)
        }
    }, [IC])

    const checkIC = async (IC) => {
        const querySnapshot = await getDocs(collection(db, "patients"))
        for (const doc of querySnapshot.docs) {
            if (doc.data().IC === IC) {
                return false // IC already exists, return false
            }
        }
        return true
    }

    const handleCreate = async (event) => {
        event.preventDefault()
        const result = await checkIC(IC)
        console.log(result)
        if (result) {
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
                allergy: allergy,
                remark: remark,
            })
            setIsCreate(true)
            alert("Patient created successfully")
        } else {
            alert("Patient with the same IC/Passport number already exists")
        }
    }

    const handleSendToQueue = (event) => {
        event.preventDefault()
        if (!isCreate) {
            alert("Please create the patient first")
        } else {
            toggleInnerModal()
        }
    }

    const handleAddToQueue = async () => {
        await addDoc(collection(db, "queues"), {
            patientId: patientId,
            patientName: name,
            doctorId: doctorId,
            complains: complains,
            status: "waiting",
        })
        toggleInnerModal()
        toggleModal()
    }

    return (
        <div className="">
            <li className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Register New</span>
                </button>
            </li>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Register New"
                shouldCloseOnOverlayClick={false}
            >
                <CloseButton toggleModal={toggleModal} />
                <form onSubmit={handleCreate}>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label>Title</label>
                            <select className="select-dropdown" onChange={(e) => setTitle(e.target.value)}>
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
                            <input type="text" onChange={(e) => setIC(e.target.value)} required />
                        </div>
                        <div className="flex flex-col">
                            <label>Gender</label>
                            <select className="select-dropdown" onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>DOB *</label>
                            <input id="dob" type="date" onChange={(e) => setDOB(e.target.value)} required />
                        </div>
                        <div className="flex flex-col">
                            <label>Age *</label>
                            <input id="age" type="text" onChange={(e) => setAge(e.target.value)} required />
                        </div>
                        <div className="flex flex-col">
                            <label>Mobile number</label>
                            <input type="tel" onChange={(e) => setMobileNumber(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Phone number</label>
                            <input type="tel" onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Email</label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Race</label>
                            <select className="select-dropdown" onChange={(e) => setRace(e.target.value)}>
                                <option value="">Select</option>
                                <option value="Malay">Malay</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Indian">Indian</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Marital status</label>
                            <select className="select-dropdown" onChange={(e) => setMaritalStatus(e.target.value)}>
                                <option value="">Select</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Nationality</label>
                            <select className="select-dropdown" onChange={(e) => setNationality(e.target.value)}>
                                <option value="">Select</option>
                                <option value="Malaysian">Malaysian</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Emergency contact name</label>
                            <input type="text" onChange={(e) => setEmergencyContactName(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Emergency contact number</label>
                            <input type="tel" onChange={(e) => setEmergencyContactNumber(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Blood type</label>
                            <select className="select-dropdown" onChange={(e) => setBloodType(e.target.value)}>
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
                            <select className="select-dropdown" onChange={(e) => setKnowAboutUs(e.target.value)}>
                                <option value="">Select</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Google">Google</option>
                                <option value="Friends">Friends</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Panel company</label>
                            <select className="select-dropdown" onChange={(e) => setPanelCompany(e.target.value)}>
                                <option value="">Select</option>
                                <option value="AIA">AIA</option>
                                <option value="Allianz">Allianz</option>
                                <option value="AXA">AXA</option>
                                <option value="Great Eastern">Great Eastern</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Occupation</label>
                            <input type="text" onChange={(e) => setOccupation(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Preferred language</label>
                            <select className="select-dropdown" onChange={(e) => setPreferredLanguage(e.target.value)}>
                                <option value="">Select</option>
                                <option value="English">English</option>
                                <option value="Malay">Malay</option>
                                <option value="Chinese">Chinese</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Preferred communication</label>
                            <select
                                className="select-dropdown"
                                onChange={(e) => setPreferredCommunication(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Email">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="WhatsApp">WhatsApp</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Refer by</label>
                            <input type="text" onChange={(e) => setReferBy(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Address</label>

                            <textarea rows={4} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Second address</label>
                            <textarea rows={4} onChange={(e) => setSecondAddress(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Allergy/Medical history</label>
                            <textarea rows={4} onChange={(e) => setAllergy(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Remark</label>
                            <textarea rows={4} onChange={(e) => setRemark(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex flex-row mt-16 justify-end">
                        <button id="createButton" className="button-green rounded m-2" type="submit">
                            Create
                        </button>
                        <button
                            id="sendToQueueButton"
                            hidden="true"
                            className="button-green rounded m-2"
                            type="button"
                            onClick={handleSendToQueue}
                        >
                            Send to queue
                        </button>
                    </div>
                </form>
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
                    <CloseButton toggleModal={toggleInnerModal} />
                    <form onSubmit={handleAddToQueue}>
                            <div className="flex"> 
                                <p>Patient Name:</p>
                                <div className="font-semibold pl-2">{name}</div>
                            </div>
                            <div className="flex flex-col"> 
                                <p>Complains:</p>
                                <textarea rows={4} onChange={(e) => setComplains(e.target.value)} />
                            </div>
                            <div className="flex justify-center pt-4">
                                <button className="button-green rounded" type="submit">Add To Queue</button>
                            </div>
                    </form>
                </Modal>
            </Modal>
        </div>
    )
}

export default RegisterNew
