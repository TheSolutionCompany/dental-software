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

export default function EditAppointment(props) {
    const [isOpen, setIsOpen] = useState(false);

    const { getAppointments, updateApptDetails } = useDatabase();

    const doctorId = props.doctorId;
    const doctorName = props.doctorName;
    const patientName = props.patientName;
    const appointmentId = props.appointmentId;
    const currTimeslot = props.currTimeslot;
    const workingHours = props.workingHours;
    const hidden = props.hidden;
    const onClose = props.onClose;

    const [processedWorkingHours, setProcessedWorkingHours] = useState([]);
    const [doctorAppts, setDoctorAppts] = useState([]);
    const [timeslot, setTimeslot] = useState({});
    const [complaints, setComplaints] = useState(props.complaints);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const calendarRef = useRef();

    useEffect(() => {
        getAppointments(doctorId).then((appts) => {
            setDoctorAppts([]);
            for (let appt of appts) {
                let apptData = appt.data();
                if (apptData.status !== "cancelled" && appt.id !== appointmentId) {
                    let start = new Date(apptData.startTime.seconds * 1000);
                    let end = new Date(apptData.endTime.seconds * 1000);
                    let title = `Booked by ${apptData.patientName}`;
                    let color = "#36454f";
                    let newEvent = { id: appt.id, start, end, title, color };
                    setDoctorAppts((prev) => [...prev, newEvent]);
                }
            }
            setDoctorAppts((prev) => [...prev, currTimeslot]);
        });

        let flattened = Object.values(workingHours).reduce((acc, newTimeslots) => acc.concat(newTimeslots), []);
        let result = parseToBusinessHoursFormat(flattened);
        setProcessedWorkingHours(result);
    }, []);

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
            title: `New timeslot`,
        };
        calendarApi.addEvent(newEvent);
        setTimeslot(newEvent);
    }

    async function handleUpdateAppt(event) {
        event.preventDefault();

        let calendarApi = calendarRef.current.getApi();
        let timeslot = calendarApi.getEventById("appt");

        document.getElementById("submitButton").disabled = true;

        if(await updateApptDetails(doctorId, appointmentId, timeslot.start, timeslot.end, complaints)){
            toggleModal();
            toast.success("Appointment edited successfully", {
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
            onClose();
        } else {
            document.getElementById("submitButton").disabled = false;
            toast.error("Failed to edit appointment. Please try again later.", {
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

    return (
        <div className="">
            <div className="cursor-pointer select-none">
                <button onClick={toggleModal} className="button-blue rounded relative left-5" hidden={hidden}>
                    Edit Appointment
                </button>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
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
                <CloseButton func={toggleModal} />
                <form onSubmit={handleUpdateAppt}>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="grid grid-cols-1 gap-1 h-3/5">
                            <p>
                                Patient Name: <strong>{patientName}</strong>
                            </p>
                            <br />
                            <p>
                                Attending Doctor: <strong>{doctorName}</strong>
                            </p>

                            <label style={{ marginTop: "20px" }}>Complaints</label>
                            <textarea
                                value={complaints}
                                onChange={(e) => setComplaints(e.target.value)}
                                rows={10}
                            ></textarea>
                        </div>

                        <div>
                            <b>Preferred Timeslot</b>
                            <FullCalendar
                                plugins={[timeGridPlugin, interactionPlugin]}
                                selectable={true}
                                select={handleSelect}
                                ref={calendarRef}
                                allDaySlot={false}
                                businessHours={processedWorkingHours}
                                selectConstraint={"businessHours"}
                                eventConstraint={"businessHours"}
                                validRange={{ start: new Date() }}
                                eventOverlap={false}
                                events={doctorAppts}
                            />

                            <div className="flex float-right pt-4">
                                <button className="button-green rounded" type="submit" id="submitButton">
                                    Update Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
