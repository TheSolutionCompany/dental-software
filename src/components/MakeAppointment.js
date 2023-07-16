import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { useDatabase } from "../contexts/DatabaseContext";
import CloseButton from "./CloseButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { parseToBusinessHoursFormat } from "../util/EventUtil";

Modal.setAppElement("#root");

export default function MakeAppointment(props) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isInnerOpen, setIsInnerOpen] = useState(false);

    const { availableDoctors, search, getAppointments, makeAppointment } = useDatabase();
    const [objectifiedDoctors, setObjectifiedDoctors] = useState();

    const [searchByName, setSearchByName] = useState("");
    const [searchByIc, setSearchByIc] = useState("");
    const [searchByMobileNumber, setsearchByMobileNumber] = useState("");

    const [patientsList, setPatientsList] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientIc, setPatientIc] = useState("");

    const [doctorId, setDoctorId] = useState("");
    const [isDoctorSelected, setIsDoctorSelected] = useState(false);
    const [doctorAppts, setDoctorAppts] = useState([]);
    const [workingHours, setWorkingHours] = useState([]);

    const [timeslot, setTimeslot] = useState({});
    const [isTimeslotSelected, setIsTimeslotSelected] = useState(false);

    const [complaints, setComplaints] = useState("");

    const [isValidInput, setIsValidInput] = useState(false);

    const calendarRef = useRef();

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
            setPatientGender("");
            setPatientAge("");
            setPatientIc("");
            setComplaints("");
            setWorkingHours([]);
            setComplaints("");
            setTimeslot({});
            setIsDoctorSelected(false);
            setIsTimeslotSelected(false);
            setIsValidInput(false);
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

    // for the sake of my sanity tqvm
    useEffect(() => {
        let result = {};
        for (let doctor of availableDoctors) {
            result[doctor.id] = doctor.data();
        }
        setObjectifiedDoctors(result);
    }, [availableDoctors]);

    useEffect(() => {
        if (doctorId) {
            let flattened = Object.values(objectifiedDoctors[doctorId].workingHours).reduce(
                (acc, newTimeslots) => acc.concat(newTimeslots),
                []
            );
            let result = parseToBusinessHoursFormat(flattened);
            setWorkingHours(result);
        }
    }, [doctorId]);

    function handleMakeAppt(patient) {
        setPatientId(patient.id);
        setPatientName(patient.data().name);
        setPatientGender(patient.data().gender);
        setPatientAge(patient.data().age);
        setPatientIc(patient.data().ic);
        toggleInnerModal();
    }

    useEffect(() => {
        let isDoctorSelected = doctorId !== "" && doctorId != null && doctorId != undefined;
        let isTimeslotSelected = timeslot.id && timeslot != null && timeslot != undefined;
        setIsDoctorSelected(isDoctorSelected);
        setIsTimeslotSelected(isTimeslotSelected);
        setIsValidInput(isDoctorSelected && isTimeslotSelected);
    }, [doctorId, timeslot]);

    async function handleSubmitAppt(event) {
        event.preventDefault();

        let calendarApi = calendarRef.current.getApi();
        let timeslot = calendarApi.getEventById("appt");

        document.getElementById("submitButton").disabled = true;

        if (
            await makeAppointment(
                doctorId,
                patientId,
                patientName,
                patientAge,
                patientIc,
                patientGender,
                timeslot.start,
                timeslot.end,
                complaints
            )
        ) {
            toggleSearchModal();
            toggleInnerModal();
            toast.success("Appointment made successfully", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            toast.clearWaitingQueue();
        } else {
            document.getElementById("submitButton").disabled = false;
            toast.error("Failed to make appointment. Please try again later.", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            toast.clearWaitingQueue();
        }
    }

    function handleSelect(selectionInfo) {
        let calendarApi = calendarRef.current.getApi();
        let currAppt = calendarApi.getEventById("appt");
        if (currAppt) {
            currAppt.remove();
        }
        let newEvent = {
            id: "appt",
            start: selectionInfo.start,
            end: selectionInfo.end,
            editable: true,
            title: `Appointment - ${patientName}`,
        };
        calendarApi.addEvent(newEvent);
        setTimeslot(newEvent);
    }

    function onDoctorChange(event) {
        setDoctorId(event.target.value);

        let calendarApi = calendarRef.current.getApi();
        let allTimeSlots = calendarApi.getEvents();
        allTimeSlots.forEach((event) => event.remove());

        getAppointments(event.target.value).then((appts) => {
            for (let appt of appts) {
                let apptData = appt.data();
                if (apptData.status !== "cancelled") {
                    let start = new Date(apptData.startTime.seconds * 1000);
                    let end = new Date(apptData.endTime.seconds * 1000);
                    let title = `Booked by ${apptData.patientName}`;
                    let color = "#36454f";
                    calendarApi.addEvent({ id: appt.id, start, end, title, color });
                }
            }
        });
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
                style={{ overlay: { zIndex: "999" } }}
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
                                backgroundColor: "rgba(255, 255, 255, 0)",
                                zIndex: "999",
                            },
                            content: {
                                position: "absolute",
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
                        <form onSubmit={handleSubmitAppt}>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="grid grid-cols-1 gap-1 h-3/5">
                                    <p>
                                        Patient Name: <strong>{patientName}</strong>
                                    </p>

                                    <label>Attending Doctor</label>
                                    <select className="select-dropdown" onChange={onDoctorChange} required>
                                        <option disabled selected></option>
                                        {availableDoctors.map((doctor) => (
                                            <option value={doctor.id}>{doctor.data().displayName}</option>
                                        ))}
                                    </select>
                                    <p hidden={isDoctorSelected}>Please select a doctor</p>

                                    <label style={{ marginTop: "20px" }}>Complaints</label>
                                    <textarea
                                        value={complaints}
                                        onChange={(e) => setComplaints(e.target.value)}
                                        rows={10}
                                    ></textarea>
                                </div>

                                <div>
                                    <b>Preferred Timeslot</b>
                                    <br />
                                    <p hidden={isTimeslotSelected}>Please select a timeslot.</p>
                                    <FullCalendar
                                        plugins={[timeGridPlugin, interactionPlugin]}
                                        selectable={true}
                                        select={handleSelect}
                                        ref={calendarRef}
                                        allDaySlot={false}
                                        businessHours={workingHours}
                                        selectConstraint={"businessHours"}
                                        eventConstraint={"businessHours"}
                                        validRange={{ start: new Date() }}
                                        eventOverlap={false}
                                    />

                                    <div className="flex float-right pt-4">
                                        <button
                                            className="button-green rounded"
                                            type="submit"
                                            id="submitButton"
                                            disabled={!isValidInput}
                                        >
                                            Schedule Appointment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal>
                </div>
            </Modal>
        </div>
    );
}
