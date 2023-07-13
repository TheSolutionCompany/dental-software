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

    const { appointments, availableDoctors, updateApptStatus, addToQueue } = useDatabase();

    const [isDefaultMenuOpen, setIsDefaultMenuOpen] = useState(false);
    const [isAftCancelApptOpen, setIsAftCancelApptOpen] = useState(false);

    const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

    const [menuPosition, setMenuPosition] = useState([0, 0]);

    const [activeEventId, setActiveEventId] = useState("");

    const tomorrow = new Date(new Date().setHours(24, 0, 0, 0));
    const [activeEventStart, setActiveEventStart] = useState(tomorrow);

    const [doneAppointment, setDoneAppointment] = useState([]);

    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientIc, setPatientIc] = useState("");
    const [complains, setComplains] = useState("");
    const [doctorId, setDoctorId] = useState("");

    const [addToQueueSuccess, setAddToQueueSuccess] = useState(false);

    const calendarRef = useRef();

    const red = "#f00707";
    const green = "#07f017";

    // the id that will be used for calendar will be the same as the one provided by firebase
    const [eventifiedAppts, setEventifiedAppts] = useState([]);

    // this is for my sanity tqvm
    const [objectifiedAppts, setObjectifiedAppts] = useState({});

    const toggleDefaultMenu = () => {
        setIsDefaultMenuOpen(!isDefaultMenuOpen);
    };

    const toggleAftCancelAppt = () => {
        setIsAftCancelApptOpen(!isAftCancelApptOpen);
    };

    const toggleQueueModal = () => {
        setIsQueueModalOpen(!isQueueModalOpen);
    };

    const toggleBothDefaultAndQueue = () => {
        toggleDefaultMenu();
        toggleQueueModal();
    };

    useEffect(() => {
        // load the appointments here
        // eventifiedAppts is meant for calendar. they will not contain status
        let eventifiedApptsResult = [];
        let doneAppointmentResult = [];
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
                    doneAppointmentResult.push(appt.id);
                    break;
                case "queued":
                    color = green;
                    title += " (Queued)";
                    doneAppointmentResult.push(appt.id);
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
        setDoneAppointment(doneAppointmentResult);
        setObjectifiedAppts(objectifiedApptsResult);
    }, [appointments]);

    function handleEventClicked(selectionInfo) {
        if (doneAppointment.includes(selectionInfo.event.id)) {
            return;
        }

        setMenuPosition([selectionInfo.jsEvent.x, selectionInfo.jsEvent.y]);

        let activeEventId = selectionInfo.event.id;
        setActiveEventId(activeEventId);
        setActiveEventStart(selectionInfo.event.start);

        let activeEvent = objectifiedAppts[activeEventId];
        console.log(activeEvent);
        setPatientId(activeEventId);
        setPatientName(activeEvent.patientName);
        setPatientAge(activeEvent.age);
        setPatientGender(activeEvent.gender);
        setPatientIc(activeEvent.ic);

        toggleDefaultMenu();
    }

    async function handleCancelAppt() {
        toggleDefaultMenu();
        await updateApptStatus(user.uid, activeEventId, "cancelled");
        setDoneAppointment((current) => [...current, activeEventId]);
    }

    const handleAddToQueue = async (e) => {
        e.preventDefault();
        setAddToQueueSuccess(true);
        await addToQueue(patientId, patientName, patientAge, patientIc, patientGender, user.uid, complains, "waiting");
        await updateApptStatus(user.uid, activeEventId, "queued");
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
    };

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Appointment"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200" style={{ padding: "40px" }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        ref={calendarRef}
                        allDaySlot={false}
                        aspectRatio={2.25}
                        events={eventifiedAppts}
                        nowIndicator={true}
                        headerToolbar={{
                            start: "dayGridMonth,timeGridWeek,timeGridDay",
                            center: "title",
                            end: "today prev,next",
                        }}
                        eventClick={handleEventClicked}
                    />

                    <Modal
                        isOpen={isDefaultMenuOpen}
                        onRequestClose={toggleDefaultMenu}
                        style={{
                            content: {
                                width: "200px",
                                height: "100px",
                                left: `${menuPosition[0]}px`,
                                top: `${menuPosition[1]}px`,
                                textAlign: "left",
                            },
                            overlay: {
                                backgroundColor: "rgba(0, 0, 0, 0)",
                                zIndex: "999",
                            },
                        }}
                    >
                        {/*While the button is successfully disabled, pls help to turn it gray..*/}
                        <button disabled={activeEventStart > tomorrow} onClick={toggleBothDefaultAndQueue}>
                            Send To Queue
                        </button>
                        <br />
                        <button onClick={handleCancelAppt}>Cancel Appointment</button>
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
                            <p>Patient Name:</p>
                            <div className="font-semibold pl-2">{patientName}</div>
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
            </div>
        </div>
    );
};

export default Appointment;
