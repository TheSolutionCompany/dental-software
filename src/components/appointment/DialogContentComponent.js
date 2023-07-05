import React from 'react';
import { DialogContent, TextField } from '@mui/material';

const DialogContentComponent = ({
                                    eventTitle,
                                    selectedStartTime,
                                    selectedEndTime,
                                    handleEventTitleChange,
                                    handleStartTimeChange,
                                    handleEndTimeChange,
                                }) => {
    return (
        <DialogContent>
            <TextField
                label="Event Title"
                value={eventTitle}
                onChange={handleEventTitleChange}
                fullWidth
            />
            <TextField
                label="Start Time"
                type="datetime-local"
                value={selectedStartTime}
                onChange={handleStartTimeChange}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />
            <TextField
                label="End Time"
                type="datetime-local"
                value={selectedEndTime}
                onChange={handleEndTimeChange}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />
        </DialogContent>
    );
};

export default DialogContentComponent;