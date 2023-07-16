 import { getStartOfWeek, extractTimeFromDate } from "./TimeUtil";
 
 // events ==> business hours
 export function parseToBusinessHoursFormat(events) {
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
export function parseToEventsFormat(businessHours) {
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
            result.push(newEvent);
            startOfWeek = getStartOfWeek(new Date());
        }
    }
    return { result, currentCounter };
}