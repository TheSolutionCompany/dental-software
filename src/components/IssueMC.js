import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import { useDatabase } from "../contexts/DatabaseContext"
import { useAuth } from "../contexts/AuthContext"
import CloseButton from "./CloseButton"
import '../css/MC.css'
Modal.setAppElement("#root")

export const IssueMC = () => {
    // Variables from AuthContext
    const {user} = useAuth()
    // Variables from DatabaseContext
    const { availableDoctors } = useDatabase()
    // Functions from DatabaseContext
    const { search, addToQueue } = useDatabase()

    const [isOpen, setIsOpen] = useState(false)
    const [isInnerOpen, setIsInnerOpen] = useState(false)
    const [isInnerInnerOpen, setIsInnerInnerOpen] = useState(false)
    const [searchByName, setSearchByName] = useState("")
    const [searchByIC, setSearchByIC] = useState("")
    const [searchByMobileNumber, setsearchByMobileNumber] = useState("")
    const [patientsList, setPatientsList] = useState([])
    const [patientName, setPatientName] = useState("")
    const [gender, setGender] = useState("")
    const [age, setAge] = useState("")
    const [IC, setIC] = useState("")
    const [patientId, setPatientId] = useState("")
    const [complains, setComplains] = useState("")
    const [doctorId, setDoctorId] = useState("")
    const [time, setTime] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [remark, setRemark] = useState('')

    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time2 = currentDate.toLocaleTimeString();

    useEffect(() => {
        setFromDate(date)
        search(searchByName, searchByIC, searchByMobileNumber).then((result) => {
            setPatientsList(result)
        })
    }, [searchByName, searchByIC, searchByMobileNumber, search, setFromDate, date])

    const toggleModal = () => {
        if (isOpen) {
            setPatientsList([])
            setSearchByName("")
            setSearchByIC("")
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
            setIC("")
            setGender("")
        }
        setIsInnerOpen(!isInnerOpen)
    }

    const toggleInnerInnerModal = () => {
        if (isInnerInnerOpen) {
            setTime('')
            setFromDate('')
            setToDate('')
            setRemark('')
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
        setSearchByIC(event.target.value)
    }

    const handlesearchByMobileNumber = (event) => {
        setsearchByMobileNumber(event.target.value)
    }

    const handleSetFromDate = () => {
        setFromDate(date)
    }

    const handleSetTime = () => {
        setTime(time2)
    }

    const handleToDate = (e) => {
        setToDate(e.target.value)
    }

    const handleRemark = (e) => {
        setRemark(e.target.value)
    }

    const handleIssue = (patient) => {
        setPatientId(patient.id)
        setPatientName(patient.data().name)
        setGender(patient.data().gender)
        setAge(patient.data().age)
        setIC(patient.data().IC)
        toggleInnerModal()
    }

    const handleSubmit= (e) => {
        e.preventDefault()
        handleSetFromDate()
        handleSetTime()
        toggleInnerInnerModal()
    }

    const handleIssueMC= (e) => {
        e.preventDefault()
        toggleModal()
        toggleInnerModal()
        toggleInnerInnerModal()
    }

    const handlePrint = () =>{     
        //console.log('print');  
        // let printContents = document.getElementById('printablediv').innerHTML;
        // let originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        window.print();
        // document.body.innerHTML = originalContents; 
      }

    return (
        <div className="App">
            <div className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Issue MC</span>
                </button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="Register Existing"
                shouldCloseOnOverlayClick={false}
            >
                <CloseButton func={toggleModal} />
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
                            <label>Search By Mobile Number:</label>
                            <input className="w-full" type="text" defaultValue={""} onChange={handlesearchByMobileNumber} />
                        </div>
                    </div>
                    <table className="w-full h-10 bg-gray-300 font-bold border border-black">
                        <thead>
                            <tr className="w-full grid grid-cols-3 h-10 bg-gray-300 font-bold border-l border-t border-b border-black">
                                <th className="border-r border-black">Name</th>
                                <th className="border-r border-black">IC</th>
                                <th className="border-r border-black">Mobile Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientsList.map((patient) => (
                                <tr
                                    className="w-full grid grid-cols-3 h-10 bg-gray-200 font-semibold border-l border-black hover:bg-green-400 cursor-pointer"
                                    key={patient.id}
                                    onClick={() => handleIssue(patient)}
                                >
                                    <td key={patient.data().name} className="border-r border-b border-black">{patient.data().name}</td>
                                    <td key={patient.data().ic} className="border-r border-b border-black">{patient.data().ic}</td>
                                    <td key={patient.data().mobileNumber} className="border-r border-b border-black">{patient.data().mobileNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
                        }}>

                        <CloseButton func={toggleInnerModal} />

                        <form className="flex flex-col" onSubmit={handleSubmit}>
                            <label htmlFor="fromDate">Issue MC from :</label>
                            <input type="date" placeholder="Starting Date" id="fromDate" defaultValue={fromDate} />
                            <br/>
                            <label htmlFor="toDate">To :</label>
                            <input type="date" placeholder="End Date" id="toDate" onChange={handleToDate}/>
                            <br/>
                            <label htmlFor="remark">Remark</label>
                            <input type="text" placeholder="Enter your remark"
                            id="remark" onChange={handleRemark}/>
                            <br/>
                            <div style={{display:'flex',alignItems:"center", justifyContent:'center'}}><button style={{border:'1px solid black', borderRadius:'5px', backgroundColor:'lightgray', width:'120px', height:'40px'}} type="submit">Issue MC</button>
                            </div>
                        </form>
                       
                        <div>
                            
                        </div>
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
                            <CloseButton func={ () => { toggleInnerInnerModal() 
                            toggleInnerModal()
                            }} />
                            
                            <form className="modal-container" id="printablediv" onSubmit={handleIssueMC}>
                                <div className="flex flex-col justify-center items-center">
                                    <p className="text-align-center font-bold">Medical Certificate</p>
                                    <br/>
                                    <p className="text-align-center font-bold">Klinik Pergigian Sunlightdental</p>
                                    <p className="text-align-center">No. 87 (GF), Jalan Anggerik Emas 1.</p>
                                    <p className="text-align-center">Taman Anggerik Emas,</p>
                                    <p className="text-align-center">81200 Johor Bahru</p>
                                    <p className="text-align-center">019-9468987</p>
                                </div>
                                <br />
                                <div className="flex flex-row justify-between">
                                    <div>
                                        {fromDate} {time}
                                    </div>
                                    <div>
                                        Ref no
                                    </div>
                                </div>
                                <br/>
                                <p className="font-bold">{patientName}</p>
                                <br/>
                                <p>This is to certified that <span className="underline">{user.displayName} ({IC})</span> has examined me on <span className="underline">{fromDate}</span></p>
                                <br/>
                                <p>Due to his/her illness, he/she has ben advised to stay off work from <span className="underline">{fromDate}</span> to <span className="underline">{toDate}</span></p>
                                <br />
                                <p><span className="font-bold">Remark:</span> <span className="italic">{remark}</span> </p>
                                <br/>
                                <br/>
                                <br/>
                                <p className="font-bold" style={{fontSize: "13px"}} >Dr {user.displayName}</p>
                                <br/>
                                <div className="flex flex-col justify-center items-center">
                                    <p className="text-align-center">----------Printed: {fromDate} {time}----------</p>
                                    <p className="text-align-center">Thank you</p>
                                </div>
                            </form>
                            <br/>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}> 
                                <button style={{boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", border:'1px solid black', backgroundColor:'lightgray', width:'100px', height:'30px'}} onClick={handlePrint}>Print</button>
                            </div>
                            
                        </Modal>
                    </Modal>
                </div>
            </Modal>
        </div>
    )
}

export default IssueMC
