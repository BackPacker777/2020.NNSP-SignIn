"use strict";

import EventHandler from './EventHandler.js';

class Main {
    constructor(people) {
        const SIGN_OFFS = ['Snowmobile', 'Toboggan', 'Scavenger', 'Cpr', 'Chair'];
        this.date = new Date();
        document.getElementById("date").innerText = this.getWeekDay();
        document.getElementById("weekDay").innerText = `${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()}`;
        this.eventHandler = new EventHandler(people, SIGN_OFFS);
        this.prepUX();
    }

    getWeekDay() {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[this.date.getDay()];
    }

    prepUX() {
        document.getElementById('noPrint').style.display = 'none';
        document.getElementById('narniaDiv').style.display = 'none';
        document.getElementById('masterDiv').style.display = 'none';
        document.getElementById('modalDiv').style.display = 'none';
        document.getElementById('chosen').style.display = 'none';
        document.getElementById('formSubmit').disabled = true;
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