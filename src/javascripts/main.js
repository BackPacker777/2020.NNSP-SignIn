"use strict";

import DivContents from './DivContents2.js';
import EventHandler from './EventHandler.js';

class Main {
    constructor(people) {
        const SIGN_OFFS = ['Snowmobile', 'Toboggan', 'Scavenger', 'Cpr', 'Chair'];
        this.date = new Date();
        this.isWeekend = this.determineWeekend();
        // this.isWeekend = true;  //Turn on/off for testing
        document.getElementById("date").innerText = this.getWeekDay();
        document.getElementById("weekDay").innerText = `${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()}`;
        document.getElementById("dayNight").innerText = `${this.getDayNight()} Shift`;
        this.eventHandler = new EventHandler(people, this.getDayNight(), this.isWeekend, SIGN_OFFS);
        this.prepUX();
    }

    determineWeekend() {
        const SAT = 6, SUN = 0;
        if (this.date.getDay() === SAT || this.date.getDay() === SUN) {
            return true;
        }
    }

    getWeekDay() {
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[this.date.getDay()];
    }

    getDayNight() {
        const BEGIN_NIGHT = 14;
        const END_NIGHT = 23;
        let dayNight;
        if (this.date.getHours() > BEGIN_NIGHT && this.date.getHours() < END_NIGHT) {
            dayNight = "Night";
        } else {
            dayNight = "Day";
        }
        dayNight = 'Night';  //Turn on/off for testing
        return dayNight;
    }

    prepUX() {
        document.getElementById('noPrint').style.display = 'none';
        document.getElementById('narniaDiv').style.display = 'none';
        document.getElementById('formSubmit').disabled = true;
        if (this.getDayNight() === 'Night') {
            let counter = 1;
            const RACE_TIMES = ['', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45'];
            let teams = document.querySelectorAll("fieldset");
            for (let i = 1; i < teams.length; i++) {
                document.getElementById(`team.${i}`).style.display = 'none';
            }
            while (counter < RACE_TIMES.length) {
                document.getElementById(`team.0`).insertAdjacentHTML('beforeend', DivContents.getNightRaceDivs(0, counter, RACE_TIMES));
                DivContents.getDivs(0, counter, null, RACE_TIMES);
                this.eventHandler.changePatrollerDiv(0, counter);
                counter++;
            }
            document.getElementById(`patrollerID.0.1`).required = true;
            document.getElementById(`joinTeam.0`).value = "EXTRA Sign On (! ONLY click this if all race time slots are filled or you cannot do race course duty !)";
        } else if (this.getDayNight() === 'Day' && this.isWeekend) {
            document.getElementById(`team.0`).style.display = 'none';
        } else {
            let teams = document.querySelectorAll("fieldset");
            for (let i = 1; i < teams.length; i++) {
                document.getElementById(`team.${i}`).style.display = 'none';
            }
        }
        this.eventHandler.populatePage();
        if (this.eventHandler.populated === 1) {
            let event2 = new Event('change');
            document.dispatchEvent(event2);
        }
    }

    static async populatePatrollers() {
        const response = await fetch(`/data/patrollers.csv`, {
            method: 'post',
            headers: {'x-requested-with': 'fetch.0'}
        });
        return response.text();
    }
}

window.addEventListener('load', () => {
    Main.populatePatrollers().then((patrollers) => {
        patrollers = JSON.parse(patrollers);
        new Main(patrollers);
    });
});