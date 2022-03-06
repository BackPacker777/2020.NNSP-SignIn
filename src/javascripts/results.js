"use strict";

class results {
    constructor() {
        results.updateDate();
        // window.print();setTimeout(`window.close()`, 100);
    }

    static updateDate() {
        let date = new Date();
        document.getElementById("date").innerText = results.getWeekDay(date);
        document.getElementById("weekDay").innerText = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        document.getElementById("dayNight").innerText = results.getDayNight(date);
    }

    static getWeekDay(date) {
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[date.getDay()];
    }

    static getDayNight(date) {
        const BEGIN_NIGHT = 14;
        const END_NIGHT = 23;
        let dayNight;
        if (date.getHours() > BEGIN_NIGHT && date.getHours() < END_NIGHT) {
            dayNight = "Night";
        } else {
            dayNight = "Day";
        }
        return dayNight;
    }
}

window.addEventListener('load', () => {
    new results();
});