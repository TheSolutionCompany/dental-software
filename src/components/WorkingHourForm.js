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

Modal.setAppElement("#root");

export default function WorkingHourForm(props) {
    const [isOpen, setIsOpen] = useState(false);

    const [isInnerOpen, setIsInnerOpen] = useState(false);
    const [innerModalPosition, setInnerModalPosition] = useState([0, 0]);
    const [activeEventId, setActiveEventId] = useState("");

    const { editWorkingHours } = useDatabase();

    const activeEmployee = props.activeEmployee;

    const [eventCounter, setEventCounter] = useState(1);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const toggleInnerModal = () => {
        setIsInnerOpen(!isInnerOpen);
    };

    const title = "Edit Working Hours";

    const calendarRef = useRef();

    function handleSubmit() {
        let calendarApi = calendarRef.current.getApi();
        console.log(parseEventArrayToMap(calendarApi.getEvents()));
    }

    // firebase cant support nested arrays. yup.
    function parseEventArrayToMap(eventArray) {
        return eventArray.map((event) => ({
            id: event.id,
            start: event.start,
            end: event.end,
            title: event.title,
        }));
    }

    function handleSelect(selectionInfo) {
        let calendarApi = calendarRef.current.getApi();
        let newEvent = {
            id: `${activeEmployee.id}_${eventCounter}`,
            start: selectionInfo.start,
            end: selectionInfo.end,
            editable: true,
            title: "Working Hours",
        };
        setEventCounter(eventCounter + 1);
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
                <button onClick={toggleModal}>{title}</button>
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
    );
}
