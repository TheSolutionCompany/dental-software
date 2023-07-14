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
import { extractTimeFromDate, getStartOfWeek } from "../util/TimeUtil";

Modal.setAppElement("#root");

export default function BusinessHourForm(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isInnerOpen, setIsInnerOpen] = useState(false);
    const [innerModalPosition, setInnerModalPosition] = useState([0, 0]);
    const [activeEventId, setActiveEventId] = useState("");

    const [timeslots, setTimeslots] = useState([]);
    const [timeslotCounter, setTimeslotCounter] = useState(1);

    const calendarRef = useRef();

    const { commonVariables, setBusinessHours } = useDatabase();

    const title = "Set Business Hours";

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const toggleInnerModal = () => {
        setIsInnerOpen(!isInnerOpen);
    };

    useEffect(() => {
        let currBusinessHours = commonVariables.find((element) => element.id === "businessHours")
        if (currBusinessHours) {
            parseToEventsFormat(currBusinessHours.data().details);
        }
    }, [commonVariables]);

    function handleSelect(selectionInfo) {
        let calendarApi = calendarRef.current.getApi();
        let newEvent = {
            id: `Business Hours_${timeslotCounter}`,
            start: selectionInfo.start,
            end: selectionInfo.end,
            editable: true,
            title: "Business Hours",
        };
        setTimeslotCounter(timeslotCounter + 1);
        calendarApi.addEvent(newEvent);
    }

    // events ==> business hours
    function parseToBusinessHoursFormat(events) {
        let result = [];
        for (let timeslot of events) {
            let slot = {
                daysOfWeek: [timeslot.start.getDay()],
                startTime: extractTimeFromDate(timeslot.start),
                endTime: extractTimeFromDate(timeslot.end),
            };
            result.push(slot);
        }
        return result;
    }

    // business hours ==> events
    function parseToEventsFormat(businessHours) {
        let startOfWeek = getStartOfWeek(new Date());
        let currentCounter = 1;
        let result = [];
        for (let slot of businessHours) {
            for (let day of slot.daysOfWeek) {
                // see FullCalendar's documentation on the format of businessHours
                let workingDay = new Date(startOfWeek.setDate(startOfWeek.getDate() + day));

                let startHours = Number(slot.startTime.split(":")[0]);
                let startMinutes = Number(slot.startTime.split(":")[1]);
                let startTime = new Date(workingDay).setHours(startHours, startMinutes);

                let endHours = Number(slot.endTime.split(":")[0]);
                let endMinutes = Number(slot.endTime.split(":")[1]);
                let endTime = new Date(workingDay).setHours(endHours, endMinutes);

                let newEvent = {
                    id: `Business Hours_${currentCounter}`,
                    start: startTime,
                    end: endTime,
                    editable: true,
                    title: "Business Hours",
                };
                currentCounter++;
                setTimeslotCounter((prev) => prev + 1);
                result.push(newEvent);
                startOfWeek = getStartOfWeek(new Date());
            }
        }
        setTimeslots(result);
    }

    async function handleSubmit() {
        let calendarApi = calendarRef.current.getApi()
        let allTimeSlots = calendarApi.getEvents();
        let newBusinessHours = parseToBusinessHoursFormat(allTimeSlots);

        document.getElementById("submitButton").disabled = true;

        if (await setBusinessHours(newBusinessHours)) {
            toggleModal();
            toast.success("Business hours edited successfully", {
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
        }else {
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
        <div className="App">
            <div className="cursor-pointer select-none">
                <button
                    onClick={toggleModal}
                    className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="text-left flex-1 ml-3 whitespace-nowrap">Set Business Hours</span>
                </button>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel={title}
                shouldCloseOnOverlayClick={false}
                style={{ overlay: { zIndex: "999" } }}
            >
                <CloseButton name={title} func={toggleModal} />
                <div className="grid grid-cols-1 gap-1">
                    <div className="flex flex-col">
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
                        zIndex: "999",
                    },
                }}
            >
                <button onClick={handleDelete}>Delete</button>
            </Modal>
        </div>
    )
}
