import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";
import Modal from "react-modal";
import CloseButton from "../components/CloseButton";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { extractTimeFromDate } from "../util/TimeUtil";

// TODO: for admin, have a dropdown of doctors, then can check their appointments
// this feature is meant for rescheduling appointments... reeeeeeeee (gah just make the admin cancel and rebook lollll)
const Appointment = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("isUserSignedIn");
                navigate("/");
            })
            .catch((error) => {
                console.log("signed out fail");
            });
    };

    const { availableDoctors, updateApptStatus, updateCancelledApptRemark, getAppointments, addToQueue } =
        useDatabase();

    const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false);
    const [isCancelApptRmkOpen, setIsCancelApptRmkOpen] = useState(false);

    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

    const [activeEventId, setActiveEventId] = useState("");

    const tomorrow = new Date(new Date().setHours(24, 0, 0, 0));
    const [activeEventStart, setActiveEventStart] = useState(tomorrow);
    const [activeEventEnd, setActiveEventEnd] = useState(tomorrow);

    const [queuedAppointment, setQueuedAppointment] = useState([]);

    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientIc, setPatientIc] = useState("");
    const [complains, setComplains] = useState("");
    const [remark, setRemark] = useState("");
    const [doctorId, setDoctorId] = useState("");

    const [addToQueueSuccess, setAddToQueueSuccess] = useState(false);

    const calendarRef = useRef();

    const red = "#f00707";
    const green = "#07f017";

    // the id that will be used for calendar will be the same as the one provided by firebase
    const [eventifiedAppts, setEventifiedAppts] = useState([]);

    // this is for my sanity tqvm
    const [objectifiedAppts, setObjectifiedAppts] = useState({});

    const [isButtonHidden, setIsButtonHidden] = useState(false);

    const toggleDefaultModal = () => {
        setIsDefaultModalOpen(!isDefaultModalOpen);
    };

    const toggleCancelApptRmk = () => {
        setIsCancelApptRmkOpen(!isCancelApptRmkOpen);
    };

    const toggleQueueModal = () => {
        setIsQueueModalOpen(!isQueueModalOpen);
    };

    const toggleBothDefaultAndQueue = () => {
        toggleDefaultModal();
        toggleQueueModal();
    };

    function handleEventClicked(selectionInfo) {
        if (queuedAppointment.includes(selectionInfo.event.id)) {
            return;
        }

        let activeEventId = selectionInfo.event.id;
        setActiveEventId(activeEventId);
        setActiveEventStart(selectionInfo.event.start);
        setActiveEventEnd(selectionInfo.event.end);

        let activeEvent = objectifiedAppts[activeEventId];
        setPatientId(activeEventId);
        setPatientName(activeEvent.patientName);
        setPatientAge(activeEvent.age);
        setPatientGender(activeEvent.gender);
        setPatientIc(activeEvent.ic);
        setRemark(objectifiedAppts[activeEventId].remark);
        setIsButtonHidden(activeEvent.status === "cancelled");
        toggleDefaultModal();
    }

    async function handleCancelAppt(event) {
        event.preventDefault();
        toggleDefaultModal();
        toggleCancelApptRmk();
        await updateApptStatus(doctorId, activeEventId, "cancelled");
        await updateCancelledApptRemark(doctorId, activeEventId, remark);
        getAppointments(doctorId).then(processAppointments);
    }

    const handleAddToQueue = async (e) => {
        e.preventDefault();
        setAddToQueueSuccess(true);
        await addToQueue(patientId, patientName, patientAge, patientIc, patientGender, doctorId, complains, "waiting");
        await updateApptStatus(doctorId, activeEventId, "queued");
        const alertAddToQueueSuccess = () =>
            toast.success("Added to queue successfully", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        toast.dismiss();
        toast.clearWaitingQueue();
        alertAddToQueueSuccess();
        toggleQueueModal();
        setAddToQueueSuccess(false);
        getAppointments(doctorId).then(processAppointments);
    };

    function processAppointments(appointments) {
        let eventifiedApptsResult = [];
        let queuedAppointmentResult = [];
        let objectifiedApptsResult = {};
        for (let appt of appointments) {
            let apptData = appt.data();
            let start = new Date(apptData.startTime.seconds * 1000);
            let end = new Date(apptData.endTime.seconds * 1000);
            let color = "";
            let title = `Consultation - ${apptData.patientName}`;
            switch (apptData.status) {
                case "cancelled":
                    color = red;
                    title += " (Cancelled)";
                    break;
                case "queued":
                    color = green;
                    title += " (Queued)";
                    queuedAppointmentResult.push(appt.id);
                    break;
            }
            eventifiedApptsResult.push({
                id: appt.id,
                start,
                end,
                color,
                title,
            });
            objectifiedApptsResult[appt.id] = apptData;
        }
        setEventifiedAppts(eventifiedApptsResult);
        setQueuedAppointment(queuedAppointmentResult);
        setObjectifiedAppts(objectifiedApptsResult);
    }

    function onDoctorChange(doctorId) {
        setDoctorId(doctorId);
        getAppointments(doctorId).then(processAppointments);
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Appointment"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200">
                    <div className="pt-4 pl-8 pr-8 pb-4 h-full">
                        <div className="flex justify-start py-4">
                            <label>Doctor</label>
                            <select className="select-dropdown ml-5" onChange={(e) => onDoctorChange(e.target.value)}>
                                <option disabled selected></option>
                                {availableDoctors.map((doctor) => (
                                    <option value={doctor.id}>{doctor.data().displayName}</option>
                                ))}
                            </select>
                        </div>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            ref={calendarRef}
                            allDaySlot={false}
                            height={"90%"}
                            events={eventifiedAppts}
                            nowIndicator={true}
                            headerToolbar={{
                                start: "dayGridMonth,timeGridWeek,timeGridDay",
                                center: "title",
                                end: "today prev,next",
                            }}
                            dayMaxEventRows={true}
                            eventClick={handleEventClicked}
                        />

                        <Modal
                            isOpen={isDefaultModalOpen}
                            onRequestClose={toggleDefaultModal}
                            shouldCloseOnOverlayClick={false}
                            style={{
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
                                overlay: {
                                    zIndex: "999",
                                },
                            }}
                        >
                            <CloseButton name={"Appointment Details"} func={toggleDefaultModal} />
                            {/*While the button is successfully disabled, pls help to turn it lighter or smth idk..*/}
                            <p>
                                <strong>
                                    Consultation - {patientName} ({extractTimeFromDate(activeEventStart)}-
                                    {extractTimeFromDate(activeEventEnd)})
                                </strong>
                            </p>

                            <p>
                                Complaints:{" "}
                                {objectifiedAppts[activeEventId] ? objectifiedAppts[activeEventId].complaints : ""}
                            </p>

                            <p hidden={!isButtonHidden}>
                                Reasons for cancellation:{" "}
                                {objectifiedAppts[activeEventId] ? objectifiedAppts[activeEventId].remark : ""}
                            </p>

                            <button
                                disabled={activeEventStart > tomorrow}
                                onClick={toggleBothDefaultAndQueue}
                                className="button-blue rounded absolute bottom-5"
                                hidden={isButtonHidden}
                            >
                                Send To Queue
                            </button>

                            <button
                                onClick={toggleCancelApptRmk}
                                className="button-grey rounded absolute right-5 bottom-5"
                                hidden={isButtonHidden}
                            >
                                Cancel Appointment
                            </button>

                            <button
                                onClick={toggleCancelApptRmk}
                                className="button-blue rounded absolute bottom-5"
                                hidden={!isButtonHidden}
                            >
                                Update Cancellation Remark
                            </button>
                        </Modal>
                    </div>

                    <Modal
                        isOpen={isQueueModalOpen}
                        onRequestClose={toggleQueueModal}
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
                                zIndex: "999",
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
                        <CloseButton func={toggleQueueModal} />
                        <form onSubmit={handleAddToQueue}>
                            <div className="flex">
                                <p>
                                    <strong>
                                        Consultation - {patientName} ({extractTimeFromDate(activeEventStart)}-
                                        {extractTimeFromDate(activeEventEnd)})
                                    </strong>
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <p>Complains:</p>
                                <textarea rows={4} onChange={(e) => setComplains(e.target.value)} />
                            </div>
                            <div className="flex justify-center pt-4">
                                <button disabled={addToQueueSuccess} className="button-green rounded" type="submit">
                                    Add To Queue
                                </button>
                            </div>
                        </form>
                    </Modal>

                    <Modal
                        isOpen={isCancelApptRmkOpen}
                        onRequestClose={toggleCancelApptRmk}
                        contentLabel="Cancel Appt"
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
                        <CloseButton name={"Update Cancellation Remark"} func={toggleCancelApptRmk} />
                        <form onSubmit={handleCancelAppt}>
                            <div className="flex">
                                <p>Patient Name:</p>
                                <div className="font-semibold pl-2">{patientName}</div>
                            </div>
                            <div className="flex flex-col mt-[10px]">
                                <p>Reasons for cancellation:</p>
                                <textarea rows={4} value={remark} onChange={(e) => setRemark(e.target.value)} />
                            </div>
                            <div className="flex pt-4">
                                <button className="button-blue rounded absolute bottom-5" type="submit">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
