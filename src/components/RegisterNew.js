import React, { useEffect, useState } from "react"
import { useDatabase } from "../contexts/DatabaseContext"
import Modal from "react-modal"
import CloseButton from "./CloseButton"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

Modal.setAppElement("#root")

const RegisterNew = () => {
    // Variables from DatabaseContext
    const { availableDoctors } = useDatabase()
    // Functions from DatabaseContext
    const { checkRepeatedIc, registerNewPatient, addToQueue } = useDatabase()

    const [isCreate, setIsCreate] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isInnerOpen, setIsInnerOpen] = useState(false)

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

    const [patientId, setPatientId] = useState("")
    const [complains, setComplains] = useState("")
    const [doctorId, setDoctorId] = useState("")

    const toggleModal = () => {
        if (isOpen) {
            setIsCreate(false)
            setTitle("")
            setName("")
            setIc("")
            setGender("")
            setDob("")
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
        if (ic.length === 12 && /^\d+$/.test(ic)) {
            let tempAge
            let tempDob
            let tempGender
            const year = ic.slice(0, 2)
            const month = ic.slice(2, 4)
            const day = ic.slice(4, 6)
            const currentYear = new Date().getFullYear().toString().slice(2, 4)
            if (year <= currentYear) {
                tempAge = currentYear - year
                tempDob = "20" + year + "-" + month + "-" + day
            } else {
                tempAge = currentYear - year + 100
                tempDob = "19" + year + "-" + month + "-" + day
            }
            if (ic.charAt(11) % 2 === 1) {
                tempGender = "Male"
            } else {
                tempGender = "Female"
            }
            document.getElementById("age").value = tempAge
            document.getElementById("dob").value = tempDob
            document.getElementById("gender").value = tempGender
            setAge(tempAge)
            setDob(tempDob)
            setGender(tempGender)
        }
    }, [ic])

    const handleCreate = async (event) => {
        event.preventDefault()
        const repeated = await checkRepeatedIc(ic)
        if (!repeated) {
            await registerNewPatient(
                title,
                name,
                ic,
                gender,
                dob,
                age,
                mobileNumber,
                phoneNumber,
                email,
                race,
                maritalStatus,
                nationality,
                emergencyContactName,
                emergencyContactNumber,
                bloodType,
                knowAboutUs,
                panelCompany,
                occupation,
                preferredLanguage,
                preferredCommunication,
                referBy,
                address,
                secondAddress,
                allergy,
                remark
            )
            setIsCreate(true)
            const alertCreateSuccess = toast.success("Patient created successfully", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            alertCreateSuccess()
            document.getElementById("title").disabled = true
            document.getElementById("name").disabled = true
            document.getElementById("ic").disabled = true
            document.getElementById("gender").disabled = true
            document.getElementById("dob").disabled = true
            document.getElementById("age").disabled = true
            document.getElementById("mobileNumber").disabled = true
            document.getElementById("phoneNumber").disabled = true
            document.getElementById("email").disabled = true
            document.getElementById("race").disabled = true
            document.getElementById("maritalStatus").disabled = true
            document.getElementById("nationality").disabled = true
            document.getElementById("emergencyContactName").disabled = true
            document.getElementById("emergencyContactNumber").disabled = true
            document.getElementById("bloodType").disabled = true
            document.getElementById("knowAboutUs").disabled = true
            document.getElementById("panelCompany").disabled = true
            document.getElementById("occupation").disabled = true
            document.getElementById("preferredLanguage").disabled = true
            document.getElementById("preferredCommunication").disabled = true
            document.getElementById("referBy").disabled = true
            document.getElementById("address").disabled = true
            document.getElementById("secondAddress").disabled = true
            document.getElementById("allergy").disabled = true
            document.getElementById("remark").disabled = true
        } else {
            const alertPatientExists = () =>
                toast.warn("Patient with the same IC/Passport number already exists", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            alertPatientExists()
        }
    }

    const handleSendToQueue = (event) => {
        event.preventDefault()
        toggleInnerModal()
    }

    const handleAddToQueue = async () => {
        await addToQueue(patientId, name, age, ic, gender, doctorId, complains, "waiting")
        const alertAddToQueueSuccess = toast.success("Patient added to queue successfully", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
        alertAddToQueueSuccess()
        toggleInnerModal()
        toggleModal()
    }

    return (
        <div className="">
            <div className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Register New</span>
                </button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Register New"
                shouldCloseOnOverlayClick={false}
            >
                <CloseButton func={toggleModal} />
                <form onSubmit={handleCreate}>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label>Title</label>
                            <select id="title" className="select-dropdown" onChange={(e) => setTitle(e.target.value)}>
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
                                id="name"
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
                            <input id="ic" type="text" onChange={(e) => setIc(e.target.value)} required />
                        </div>
                        <div className="flex flex-col">
                            <label>Gender *</label>
                            <select
                                id="gender"
                                className="select-dropdown"
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>DOB *</label>
                            <input id="dob" type="date" onChange={(e) => setDob(e.target.value)} required />
                        </div>
                        <div className="flex flex-col">
                            <label>Age *</label>
                            <input id="age" type="text" onChange={(e) => setAge(e.target.value)} required />
                        </div>
                        <div className="flex flex-col">
                            <label>Mobile number *</label>
                            <input
                                id="mobileNumber"
                                type="tel"
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Phone number</label>
                            <input id="phoneNumber" type="tel" onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Email</label>
                            <input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Race</label>
                            <select id="race" className="select-dropdown" onChange={(e) => setRace(e.target.value)}>
                                <option value="">Select</option>
                                <option value="Malay">Malay</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Indian">Indian</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Marital status</label>
                            <select
                                id="maritalStatus"
                                className="select-dropdown"
                                onChange={(e) => setMaritalStatus(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Nationality</label>
                            <select
                                id="nationality"
                                className="select-dropdown"
                                onChange={(e) => setNationality(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Malaysian">Malaysian</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Emergency contact name</label>
                            <input
                                id="emergencyContactName"
                                type="text"
                                onChange={(e) => setEmergencyContactName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Emergency contact number</label>
                            <input
                                id="emergencyContactNumber"
                                type="tel"
                                onChange={(e) => setEmergencyContactNumber(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Blood type</label>
                            <select
                                id="bloodType"
                                className="select-dropdown"
                                onChange={(e) => setBloodType(e.target.value)}
                            >
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
                            <select
                                id="knowAboutUs"
                                className="select-dropdown"
                                onChange={(e) => setKnowAboutUs(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Google">Google</option>
                                <option value="Friends">Friends</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Panel company</label>
                            <select
                                id="panelCompany"
                                className="select-dropdown"
                                onChange={(e) => setPanelCompany(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="AIA">AIA</option>
                                <option value="Allianz">Allianz</option>
                                <option value="AXA">AXA</option>
                                <option value="Great Eastern">Great Eastern</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Occupation</label>
                            <input id="occupation" type="text" onChange={(e) => setOccupation(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Preferred language</label>
                            <select
                                id="preferredLanguage"
                                className="select-dropdown"
                                onChange={(e) => setPreferredLanguage(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="English">English</option>
                                <option value="Malay">Malay</option>
                                <option value="Chinese">Chinese</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label>Preferred communication</label>
                            <select
                                id="preferredCommunication"
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
                            <input id="referBy" type="text" onChange={(e) => setReferBy(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Address</label>
                            <textarea id="address" rows={4} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Second address</label>
                            <textarea id="secondAddress" rows={4} onChange={(e) => setSecondAddress(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Allergy/Medical history</label>
                            <textarea id="allergy" rows={4} onChange={(e) => setAllergy(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label>Remark</label>
                            <textarea id="remark" rows={4} onChange={(e) => setRemark(e.target.value)} />
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
                            <select className="select-dropdown" onChange={(e) => setDoctorId(e.target.value)} required>
                                <option disabled selected></option>
                                {availableDoctors.map((doctor) => (
                                    <option value={doctor.id}>{doctor.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-center pt-4">
                            <button className="button-green rounded" type="submit">
                                Add To Queue
                            </button>
                        </div>
                    </form>
                </Modal>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default RegisterNew
