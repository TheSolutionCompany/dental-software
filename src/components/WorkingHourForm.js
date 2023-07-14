import React, { useEffect, useState, useRef } from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import Modal from "react-modal";
import CloseButton from "./CloseButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { changeToCurrentWeek } from "../util/TimeUtil";

Modal.setAppElement("#root");

// I am so sorry to those who need to read this piece of code (other than me)
// You can tell this feature is held tgt with a lot of bandaids...
export default function WorkingHourForm(props) {
    const [isOpen, setIsOpen] = useState(false);

    const [isInnerOpen, setIsInnerOpen] = useState(false);
    const [innerModalPosition, setInnerModalPosition] = useState([0, 0]);
    const [activeEventId, setActiveEventId] = useState("");

    const { editWorkingHours, commonVariables } = useDatabase();

    const activeEmployee = props.activeEmployee;

    const [timeslots, setTimeslots] = useState([]);
    const [timeslotCounter, setTimeslotCounter] = useState(1);

    const [businessHours, setBusinessHours] = useState([]);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const toggleInnerModal = () => {
        setIsInnerOpen(!isInnerOpen);
    };

    const title = "Edit Working Hours";

    const calendarRef = useRef();

    useEffect(() => {
        let flattened = Object.values(activeEmployee.workingHours).reduce(
            (acc, newTimeslots) => acc.concat(newTimeslots),
            []
        );
        flattened.sort(compareTwoTimeslots);
        if (flattened.length > 0) {
            // this is to help with the event id... i know, another strange code here...
            let lastTimeslotIndex = Number(flattened[flattened.length - 1].id.split("_")[1]);
            setTimeslotCounter(lastTimeslotIndex + 1);
        }
        flattened.forEach((timeslot) => {
            timeslot.start = changeToCurrentWeek(timeslot.start);
            timeslot.end = changeToCurrentWeek(timeslot.end);
            timeslot.editable = true;
        });
        setTimeslots(flattened);

        let currBusinessHours = commonVariables.find((element) => element.id === "businessHours")
        if(currBusinessHours){
            setBusinessHours(currBusinessHours.data().details);
        }
    }, [activeEmployee.workingHours, commonVariables]);

    function compareTwoTimeslots(timeslot1, timeslot2) {
        let timeslotNumber1 = Number(timeslot1.id.split("_")[1]);
        let timeslotNumber2 = Number(timeslot2.id.split("_")[1]);
        if (timeslotNumber1 < timeslotNumber2) {
            return -1;
        } else if (timeslotNumber1 > timeslotNumber2) {
            return 1;
        } else {
            return 0;
        }
    }

    async function handleSubmit() {
        let calendarApi = calendarRef.current.getApi();
        let finalWorkingHours = parseEventArrayToMap(calendarApi.getEvents());

        document.getElementById("submitButton").disabled = true;

        if (await editWorkingHours(activeEmployee.id, finalWorkingHours)) {
            toggleModal();
            toast.success("Working hours edited successfully", {
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
            toast.error("Failed to edit working hours. Please try again later.", {
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

    // firebase cant support nested arrays. yup.
    function parseEventArrayToMap(eventArray) {
        let simplifiedList = eventArray.map((event) => ({
            id: event.id,
            start: event.start,
            end: event.end,
            title: event.title,
        }));
        let result = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        for (let item of simplifiedList) {
            result[item.start.getDay()].push(item);
        }
        return result;
    }

    function handleSelect(selectionInfo) {
        let calendarApi = calendarRef.current.getApi();
        let newEvent = {
            id: `${activeEmployee.id}_${timeslotCounter}`,
            start: selectionInfo.start,
            end: selectionInfo.end,
            editable: true,
            title: "Working Hours",
        };
        setTimeslotCounter(timeslotCounter + 1);
        calendarApi.addEvent(newEvent);
    }

    function handleEventClicked(selectionInfo) {
        setInnerModalPosition([selectionInfo.jsEvent.x, selectionInfo.jsEvent.y]);
        setActiveEventId(selectionInfo.event.id);
        toggleInnerModal();
    }

    function handleDelete() {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.getEventById(activeEventId).remove();
        toggleInnerModal();
    }

    return (
        <div className="">
            <div>
                <button onClick={toggleModal} className="hover:text-blue-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                    </svg>
                </button>
            </div>

            <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel={title} shouldCloseOnOverlayClick={false}>
                <CloseButton name={title} func={toggleModal} />
                <div className="grid grid-cols-1 gap-1">
                    <div className="flex flex-col">
                        <p>
                            Employee name: <b>{activeEmployee.displayName}</b>
                        </p>
                        <FullCalendar
                            plugins={[timeGridPlugin, interactionPlugin]}
                            dayHeaderFormat={{ weekday: "long" }}
                            selectable={true}
                            select={handleSelect}
                            headerToolbar={{ left: "", right: "" }}
                            ref={calendarRef}
                            eventClick={handleEventClicked}
                            events={timeslots}
                            allDaySlot={false}
                            businessHours={businessHours}
                            selectConstraint={"businessHours"}
                            eventConstraint={"businessHours"}
                            eventOverlap={false}
                        />
                        <button onClick={handleSubmit} className="button-green rounded" id="submitButton">
                            Submit
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isInnerOpen}
                onRequestClose={toggleInnerModal}
                style={{
                    content: {
                        width: "9%",
                        height: "9%",
                        left: `${innerModalPosition[0]}px`,
                        top: `${innerModalPosition[1]}px`,
                        textAlign: "center",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                    },
                }}
            >
                <button onClick={handleDelete}>Delete</button>
            </Modal>
        </div>
    )
}
