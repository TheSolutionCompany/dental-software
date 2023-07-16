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
import { parseToEventsFormat, parseToBusinessHoursFormat } from "../util/EventUtil";

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
            let output = parseToEventsFormat(currBusinessHours.data().details);
            setTimeslots(output.result);
            setTimeslotCounter(output.currentCounter);
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

    function handleRightClick(selectionInfo) {
        const eventId = selectionInfo.event.id;
        selectionInfo.el.addEventListener("contextmenu", (jsEvent) => {
            jsEvent.preventDefault();
            setInnerModalPosition([jsEvent.x, jsEvent.y]);
            setActiveEventId(eventId);
            toggleInnerModal();
        })
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
                            events={timeslots}
                            allDaySlot={false}
                            eventDidMount={handleRightClick}
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
