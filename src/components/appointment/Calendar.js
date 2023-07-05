import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import DialogContentComponent from './DialogContentComponent';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);

    const handleSelectSlot = (slotInfo) => {
        const selectedStartDate = moment(slotInfo.start).format('YYYY-MM-DD');
        const selectedEndDate = moment(slotInfo.end).subtract(1, 'day').format('YYYY-MM-DD');
        const currentTime = moment().format('HH:mm');
        const startTime = `${selectedStartDate}T${currentTime}`;
        const endTime = `${selectedEndDate}T${currentTime}`;

        setSelectedSlot(slotInfo);
        setDialogOpen(true);
        setSelectedStartTime(startTime);
        setSelectedEndTime(endTime);
    };

    const handleEventClick = (event) => {
        setSelectedSlot(null);
        setEventTitle(event.title);
        setSelectedStartTime(event.start);
        setSelectedEndTime(event.end);
        setDialogOpen(true);
    };

    const handleEventDelete = (event) => {
        const updatedEvents = events.filter((e) => e !== event);
        setEvents(updatedEvents);
    };

    const handleEventTitleChange = (e) => {
        setEventTitle(e.target.value);
    };

    const handleStartTimeChange = (e) => {
        setSelectedStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setSelectedEndTime(e.target.value);
    };

    useEffect(() => {
        if (selectedSlot && selectedSlot.event) {
            setEventTitle(selectedSlot.event.title);
            setSelectedStartTime(selectedSlot.event.start);
            setSelectedEndTime(selectedSlot.event.end);
        }
    }, [selectedSlot]);

    const handleConfirm = () => {
        if (eventTitle && selectedStartTime && selectedEndTime) {
            if (selectedSlot && selectedSlot.event) {
                // Editing an existing event
                const updatedEvents = events.map((event) => {
                    if (event === selectedSlot.event) {
                        return {
                            ...event,
                            title: eventTitle,
                            start: selectedStartTime,
                            end: selectedEndTime,
                        };
                    }
                    return event;
                });
                setEvents(updatedEvents);
            } else {
                // Creating a new event
                const newEvent = {
                    title: eventTitle,
                    start: selectedStartTime,
                    end: selectedEndTime,
                };
                setEvents([...events, newEvent]);
            }
        }
        setSelectedSlot(null);
        setEventTitle('');
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        setDialogOpen(false);
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable={true}
                onSelectEvent={handleEventClick}
                onSelectSlot={handleSelectSlot}
            />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Select Date and Time</DialogTitle>
                <DialogContentComponent
                    eventTitle={eventTitle}
                    selectedStartTime={selectedStartTime}
                    selectedEndTime={selectedEndTime}
                    handleEventTitleChange={handleEventTitleChange}
                    handleStartTimeChange={handleStartTimeChange}
                    handleEndTimeChange={handleEndTimeChange}
                />
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalendarComponent;