import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";
import Modal from "react-modal";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
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

    const { appointments, updateApptStatus } = useDatabase();

    const [isDefaultMenuOpen, setIsDefaultMenuOpen] = useState(false);
    const [isAftCancelApptOpen, setIsAftCancelApptOpen] = useState(false);

    const [menuPosition, setMenuPosition] = useState([0, 0]);

    const [activeEventId, setActiveEventId] = useState("");

    const tomorrow = new Date(new Date().setHours(24, 0, 0, 0));
    const [activeEventStart, setActiveEventStart] = useState(tomorrow);

    const [doneAppointment, setDoneAppointment] = useState([]);

    const calendarRef = useRef();

    const red = "#f00707";
    const green = "#07f017";

    // the id that will be used for calendar will be the same as the one provided by firebase
    const [eventifiedAppts, setEventifiedAppts] = useState([]);

    const toggleDefaultMenu = () => {
        setIsDefaultMenuOpen(!isDefaultMenuOpen);
    };

    const toggleAftCancelAppt = () => {
        setIsAftCancelApptOpen(!isAftCancelApptOpen);
    };

    useEffect(() => {
        // load the appointments here
        // eventifiedAppts is meant for calendar. they will not contain status
        let eventifiedApptsResult = [];
        let doneAppointmentResult = [];
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
                    title = " (Queued)";
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
        }
        setEventifiedAppts(eventifiedApptsResult);
        setDoneAppointment(doneAppointmentResult);
    }, [appointments]);

    function handleEventClicked(selectionInfo) {
        if (doneAppointment.includes(selectionInfo.event.id)) {
            return;
        }
        setMenuPosition([selectionInfo.jsEvent.x, selectionInfo.jsEvent.y]);
        setActiveEventId(selectionInfo.event.id);
        setActiveEventStart(selectionInfo.event.start);
        toggleDefaultMenu();
    }

    function handleCancelAppt() {
        toggleDefaultMenu();

        let calendarApi = calendarRef.current.getApi();
        let cancelledAppt = calendarApi.getEventById(activeEventId);
        cancelledAppt.setProp("title", cancelledAppt.title + " (Cancelled)");
        cancelledAppt.setProp("color", red);

        updateApptStatus(user.uid, activeEventId, "cancelled");
        setDoneAppointment(current => [...current, activeEventId]);
    }

    return (
        <div className="flex flex-col h-full">
            <Header className="z-50" currentPage={"Appointment"} handleLogout={handleLogout} />
            <div className="flex h-full">
                <SideBar />
                <div className="w-full bg-gray-200" style={{ padding: "40px" }}>
                    <FullCalendar
                        plugins={[timeGridPlugin, interactionPlugin]}
                        ref={calendarRef}
                        allDaySlot={false}
                        aspectRatio={2.25}
                        events={eventifiedAppts}
                        nowIndicator={true}
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
                        <button disabled={activeEventStart > tomorrow}>Send To Queue</button>
                        <br />
                        <button onClick={handleCancelAppt}>Cancel Appointment</button>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
