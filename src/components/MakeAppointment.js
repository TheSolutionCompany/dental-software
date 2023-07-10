import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { useDatabase } from "../contexts/DatabaseContext";
import CloseButton from "./CloseButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

export default function MakeAppointment(props) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isInnerOpen, setIsInnerOpen] = useState(false);

    const { availableDoctors, search, makeAppointment } = useDatabase();

    const [searchByName, setSearchByName] = useState("");
    const [searchByIc, setSearchByIc] = useState("");
    const [searchByMobileNumber, setsearchByMobileNumber] = useState("");

    const [patientsList, setPatientsList] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [patientName, setPatientName] = useState("");

    const [doctorId, setDoctorId] = useState("");
    const today = new Date();
    const [apptDate, setApptDate] = useState(today);
    const [apptStartTime, setApptStartTime] = useState("12:00");
    const [apptMinEndTime, setApptMinEndTime] = useState("12:15");
    const [apptEndTime, setApptEndTime] = useState("12:30");
    const [complaints, setComplaints] = useState("");

    useEffect(() => {
        search(searchByName, searchByIc, searchByMobileNumber).then((result) => {
            setPatientsList(result);
        });
    }, [searchByName, searchByIc, searchByMobileNumber]);

    const toggleSearchModal = () => {
        if (isSearchOpen) {
            setPatientsList([]);
            setSearchByName("");
            setSearchByIc("");
            setsearchByMobileNumber("");
        }
        setIsSearchOpen(!isSearchOpen);
    };

    const toggleInnerModal = () => {
        if (isInnerOpen) {
            setDoctorId("");
            setPatientId("");
            setPatientName("");
            setApptDate(today);
            setApptStartTime("12:00");
            setApptMinEndTime("12:15");
            setApptEndTime("12:30");
            setComplaints("");
        }
        setIsInnerOpen(!isInnerOpen);
    };

    const toUpperCase = (event) => {
        event.target.value = event.target.value.toUpperCase();
    };

    const handleSearchByName = (event) => {
        toUpperCase(event);
        setSearchByName(event.target.value);
    };

    const handleSearchByIC = (event) => {
        setSearchByIc(event.target.value);
    };

    const handlesearchByMobileNumber = (event) => {
        setsearchByMobileNumber(event.target.value);
    };

    function handleMakeAppt(patient) {
        setPatientId(patient.id);
        setPatientName(patient.data().name);
        toggleInnerModal();
    }

    useEffect(() => {
        // do validation here...
    }, [apptDate, apptStartTime, apptEndTime, complaints, doctorId])

    function handleSubmitAppt() {
        // submit appt here...
    }

    return (
        <div className="">
            <div className="cursor-pointer select-none">
                <button
                    onClick={toggleSearchModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Make Appointment</span>
                </button>
            </div>

            <Modal
                isOpen={isSearchOpen}
                onRequestClose={toggleSearchModal}
                contentLabel="Make A New Appointment"
                shouldCloseOnOverlayClick={false}
            >
                <CloseButton name="Make A New Appointment" func={toggleSearchModal} />
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
                        <table className="table-gray">
                            <thead>
                                <tr>
                                    <th className="w-1/3">Name</th>
                                    <th className="w-1/3">IC</th>
                                    <th className="w-1/3">Mobile Number</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="flex flex-col w-full h-fit mt-[-1px] overflow-auto">
                        <table className="table-gray">
                            <tbody>
                                {patientsList.map((patient) => (
                                    <tr className="tr-hover" key={patient.id} onClick={() => handleMakeAppt(patient)}>
                                        <td key={patient.data().name} className="w-1/3">
                                            {patient.data().name}
                                        </td>
                                        <td key={patient.data().ic} className="bw-1/3">
                                            {patient.data().ic}
                                        </td>
                                        <td key={patient.data().mobileNumber} className="w-1/3">
                                            {patient.data().mobileNumber}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
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
                                left: "500px",
                                right: "500px",
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
                        <form className="flex flex-col" onSubmit={handleSubmitAppt}>
                            <p>Patient Name: <strong>{patientName}</strong></p>
                            <label style={{ marginTop: "20px" }}>Appointment Date</label>
                            <input
                                type="date"
                                value={apptDate}
                                onChange={(e) => {
                                    setApptDate(e.target.value);
                                }}
                                required
                                min={new Date().toISOString().split("T")[0]}
                            />

                            <label style={{ marginTop: "20px" }}>Appointment Starting Time</label>
                            <input
                                type="time"
                                value={apptStartTime}
                                onChange={(e) => {
                                    setApptStartTime(e.target.value);
                                }}
                                required
                            />

                            <label style={{ marginTop: "20px" }}>Appointment Ending Time</label>
                            <input
                                type="time"
                                value={apptEndTime}
                                onChange={(e) => {
                                    setApptEndTime(e.target.value);
                                }}
                                required
                            />

                            <label style={{ marginTop: "20px" }}>Complaints</label>
                            <textarea value={complaints} onChange={(e) => setComplaints(e.target.value)}></textarea>

                            <label>Attending Doctor</label>
                            <select className="select-dropdown" onChange={(e) => setDoctorId(e.target.value)} required>
                                <option disabled selected></option>
                                {availableDoctors.map((doctor) => (
                                    <option value={doctor.id}>{doctor.data().displayName}</option>
                                ))}
                            </select>

                            <div className="flex justify-center pt-4" style={{ marginTop: "20px" }}>
                                <button className="button-green rounded" type="submit">
                                    Schedule Appointment
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </Modal>
        </div>
    );
}
