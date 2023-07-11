export function changeToCurrentWeek(time) {
    let initialTime = time.seconds ? new Date(time.seconds * 1000) : time;
    let initialHours = initialTime.getHours();
    let initialMinutes = initialTime.getMinutes();
    let today = new Date();
    let result = today.getDate() - today.getDay() + initialTime.getDay();
    let resultDate = new Date(today.setDate(result));
    let resultWithSeconds = new Date(resultDate.setHours(initialHours, initialMinutes, 0, 0));
    return resultWithSeconds;
}

export function getStartOfWeek(date) {
    return new Date(new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0));
}

export function extractTimeFromDate(date){
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let hourString = hours < 10 ? `0${hours}` : hours
    let minuteString = minutes < 10 ? `0${minutes}` : '' + minutes

    return `${hourString}:${minuteString}`
}
