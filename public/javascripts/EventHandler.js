"use strict";

import DivContents from "./DivContents2.js";

export default class EventHandler {
    constructor(patrollers, dayNight, isWeekend) {
        this.signedIn = [];
        this.patrollers = patrollers;
        this.dayNight = dayNight;
        this.halfDay = false;
        this.teamCounts = [0,0,0,0,0];
        this.isWeekend = isWeekend;
        this.buttons = document.querySelectorAll("input[type=button]");
        this.handleSignOnButtons();
        this.validate();
    }

    handleSignOnButtons() {
        let counter = [1,1,1,1,1,1,1];
        const LEADERS = 6;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].addEventListener('click', () => {
                let teamNum = Number(this.buttons[i].id.substr(9, 1));
                if (teamNum > 0) {
                    for (let button of this.buttons) {
                        document.getElementById(button.id).disabled = true;
                    }
                }
                if (teamNum === LEADERS) {
                    let isLeader = false;
                    let password = prompt(`What is your Patroller ID?`);
                    for (let person of this.patrollers) {
                        if (person.ID === password && person.LEADER) {
                            isLeader = true;
                            this.buttons[i].disabled = true;
                            document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, counter[teamNum], person.LEADER));
                            document.getElementById(`patrollerID.${LEADERS}.${counter[teamNum]}`).value = person.ID;
                            this.changePatrollerDiv(LEADERS, counter[LEADERS]);
                            if (this.dayNight === 'Day') {
                                this.handleHalfDay(teamNum, counter[teamNum]);
                            }
                            let element = document.getElementById(`patrollerID.${LEADERS}.${counter[teamNum]}`);
                            let event = new Event('change');
                            element.dispatchEvent(event);
                            //http://2ality.com/2013/06/triggering-events.html
                            counter[teamNum]++;
                            break;
                        }
                    }
                    if (!isLeader) {
                        alert(`Incorrect ID for leadership/trainers team. Please try again or sign on to a different team.`);
                    }
                } else {
                    this.buttons[i].disabled = true;
                    document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, counter[teamNum]));
                    if (this.dayNight === 'Day') {
                        this.handleHalfDay(teamNum, counter[teamNum]);
                    }
                    this.changePatrollerDiv(teamNum, counter[teamNum]);
                    counter[teamNum]++;
                }
            });
        }
    }

    changePatrollerDiv(teamNum, counter) {
        // console.log(teamNum);console.log(counter);
        document.getElementById(`patrollerID.${teamNum}.${counter}`).addEventListener('change', () => {
            let correctID = false;
            if (document.getElementById(`patrollerID.${teamNum}.${counter}`).value !== '') {
                if (this.signedIn.length > 0) {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (i < this.signedIn.length && this.signedIn[i].ID === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                            alert(`You are already logged in.`);
                            document.getElementById(`patrollerID.${teamNum}.${counter}`).value = '';
                            break;
                        } else if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                            if (this.dayNight !== "Night") {
                                document.getElementById(`person.${teamNum}.${counter}`).style.backgroundColor = 'white';
                            }
                            this.populateDiv(teamNum, counter, i);
                            document.getElementById(`radioNum.${teamNum}.${counter}`).required = true;
                            correctID = true;
                            document.getElementById(`radioNum.${teamNum}.${counter}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.${teamNum}.${counter}`).value, `radio`);
                            });
                            if (teamNum !== 5) {
                                document.getElementById(`guest.${teamNum}.${counter}`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.${teamNum}.${counter}`).value, `guest`);
                                });
                            }
                            if (this.isWeekend) {
                                this.teamCounts[teamNum]++;
                                this.enforceTeamBalance(teamNum);
                            }
                            break;
                        }
                    }
                    if (correctID !== true) {
                        alert(`Invalid ID number. Please try again... Or don't...`);
                        document.getElementById(`patrollerID.${teamNum}.${counter}`).value = '';
                    }
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                            if (this.dayNight !== "Night") {
                                document.getElementById(`person.${teamNum}.${counter}`).style.backgroundColor = 'white';
                            }
                            this.populateDiv(teamNum, counter, i);
                            document.getElementById(`radioNum.${teamNum}.${counter}`).required = true;
                            correctID = true;
                            document.getElementById(`radioNum.${teamNum}.${counter}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.${teamNum}.${counter}`).value, `radio`);
                            });
                            if (teamNum !== 5) {
                                document.getElementById(`guest.${teamNum}.${counter}`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.${teamNum}.${counter}`).value, `guest`);
                                });
                            }
                            if (this.isWeekend) {
                                this.teamCounts[teamNum]++;
                                this.enforceTeamBalance(teamNum);
                            }
                            break;
                        }
                    }
                    if (correctID !== true) {
                        alert(`Invalid ID number. Please try again... Or don't...`);
                        document.getElementById(`patrollerID.${teamNum}.${counter}`).value = '';
                    }
                }
            } else {
                this.clearDiv(teamNum, counter);
            }
        });
        /*let element = document.getElementById(`patrollerID.${teamNum}.${counter}`);
        let event = new Event('change');
        if (Number(teamNum) === 6) {
            element.dispatchEvent(event);
            //http://2ality.com/2013/06/triggering-events.html
        }*/
    }

    updatePatrollerInfo(patrollerID, radioGuestDays, whichListener) {
        for (let patroller of this.signedIn) {
            if (Number(patroller.ID) === Number(patrollerID)) {
                if (whichListener === `radio`) {
                    patroller.RADIO = radioGuestDays;
                } else if (whichListener === `guest`) {
                    patroller.GUEST = radioGuestDays;
                } else if (whichListener === `halfDaysDown`) {
                    patroller.TOTAL_DAYS = radioGuestDays;
                    patroller.DAYS++;
                    if (patroller.HALF_DAYS > 0) {
                        patroller.HALF_DAYS--;
                        console.log(patroller.HALF_DAYS);
                    }
                } else if (whichListener === 'halfDaysUp') {
                    console.log(radioGuestDays);
                    patroller.TOTAL_DAYS = radioGuestDays;
                    patroller.HALF_DAYS++;
                    console.log(patroller.HALF_DAYS);
                    if (patroller.DAYS > 0) {
                        patroller.DAYS--;
                    }
                }
                break;
            }
        }
    }

    populateDiv(teamNum, counter, i) {
        let time = new Date();
        let minutes = time.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let race;
        let dayCount = 1, halfDayCount = 0, nightsCount = 0;
        if (this.halfDay === true) {
            halfDayCount = 1;
            dayCount = 0;
        }
        if (this.dayNight === "Night") {
            nightsCount = 1;
            dayCount = 0;
        }
        document.getElementById(`time.${teamNum}.${counter}`).value = `${time.getHours()}:${minutes}`;
        if (document.getElementById(`race.${teamNum}.${counter}`)) {
            race = document.getElementById(`race.${teamNum}.${counter}`).value;
        }
        let patroller = {
            ID: Number(this.patrollers[i].ID),
            RADIO: document.getElementById(`radioNum.${teamNum}.${counter}`).value,
            NAME: `${this.patrollers[i].FIRST_NAME} ${this.patrollers[i].LAST_NAME}`,
            RATING: this.patrollers[i].RATING,
            TIME: document.getElementById(`time.${teamNum}.${counter}`).value,
            DAYS: Number(this.patrollers[i].DAYS) + dayCount,
            TEAM: teamNum,
            RACE: race,
            NIGHTS: Number(this.patrollers[i].NIGHTS) + nightsCount,
            HALF_DAYS: Number(this.patrollers[i].HALF_DAYS) + halfDayCount,
            TOTAL_DAYS: (Number(this.patrollers[i].DAYS) + dayCount) + (Number(this.patrollers[i].NIGHTS) + nightsCount) + (Number(this.patrollers[i].HALF_DAYS + halfDayCount / 2))
        };
        if (teamNum !== 5) {
            patroller.GUEST = document.getElementById(`guest.${teamNum}.${counter}`).value;
        }
        this.signedIn.push(patroller);
        console.log(this.signedIn);
        document.getElementById(`name.${teamNum}.${counter}`).value = `${this.patrollers[i].FIRST_NAME} ${this.patrollers[i].LAST_NAME}`;
        document.getElementById(`rating.${teamNum}.${counter}`).value = this.patrollers[i].RATING;
        document.getElementById(`days.${teamNum}.${counter}`).value = this.signedIn[this.signedIn.length - 1].TOTAL_DAYS;
    }

    clearDiv(teamNum, counter) {
        let getIds = document.getElementsByName('patrollerID');
        let patrollerIDs = [];
        for (let i = 0; i < getIds.length; i++) {
            patrollerIDs.push(Number(getIds[i].value));
        }
        let difference;  //https://stackoverflow.com/a/30288946/466246  Answer for difference between 2 arrays
        for (let i = 0; i < this.signedIn.length; i++) {
            if (this.signedIn.indexOf(patrollerIDs[i].ID) === -1) {
                difference = this.signedIn[i].ID;
            }
        }
        this.signedIn.splice(this.signedIn.indexOf(difference), 1);
        document.getElementById(`name.${teamNum}.${counter}`).value = ``;
        document.getElementById(`radioNum.${teamNum}.${counter}`).value = ``;
        document.getElementById(`rating.${teamNum}.${counter}`).value = ``;
        document.getElementById(`time.${teamNum}.${counter}`).value = ``;
        document.getElementById(`halfDay.${teamNum}.${counter}`).checked = false;
        document.getElementById(`days.${teamNum}.${counter}`).value = ``;
        if (teamNum !== 5) {
            document.getElementById(`guest.${teamNum}.${counter}`).value = ``;
        }
        document.getElementById(`person.${teamNum}.${counter}`).style.backgroundColor = 'yellow';
    }

    handleHalfDay(teamNum, counter) {
        console.log(`Handling half day`);
        // console.log(teamNum); console.log(counter);
        let time = new Date();
        const DAY_CUTOFF = 9;
        if (time.getHours() > DAY_CUTOFF) {
        // if (time.getHours() < DAY_CUTOFF) {
        //     document.getElementById(`guest.${teamNum}.${counter}`).disabled = true;
            document.getElementById(`halfDay.${teamNum}.${counter}`).setAttribute('checked', 'checked');
            document.getElementById(`halfDay.${teamNum}.${counter}`).disabled = true;
            if (teamNum !== 5) {
                document.getElementById(`guest.${teamNum}.${counter}`).disabled = true;
            }
            if (document.getElementById(`days.${teamNum}.${counter}`).value > 0) {
                document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) - .5;
            } else {
                document.getElementById(`days.${teamNum}.${counter}`).value = 0;
            }
            this.updatePatrollerInfo(document.getElementById(`patrollerID.${teamNum}.${counter}`).value, document.getElementById(`days.${teamNum}.${counter}`).value, `halfDaysUp`);
            this.halfDay = true;
        } else {
            document.getElementById(`halfDay.${teamNum}.${counter}`).addEventListener('click', () => {
                if (document.getElementById(`halfDay.${teamNum}.${counter}`).checked) {
                    if (teamNum !== 5) {
                        document.getElementById(`guest.${teamNum}.${counter}`).disabled = true;
                    }
                    if (document.getElementById(`days.${teamNum}.${counter}`).value > 0) {
                        document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) - .5;
                    } else {
                        document.getElementById(`days.${teamNum}.${counter}`).value = 0;
                    }
                    this.updatePatrollerInfo(document.getElementById(`patrollerID.${teamNum}.${counter}`).value, document.getElementById(`days.${teamNum}.${counter}`).value, `halfDaysUp`);
                } else {
                    if (teamNum !== 5) {
                        document.getElementById(`guest.${teamNum}.${counter}`).removeAttribute('readonly');
                    }
                    document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) + .5;
                    this.updatePatrollerInfo(document.getElementById(`patrollerID.${teamNum}.${counter}`).value, document.getElementById(`days.${teamNum}.${counter}`).value, `halfDaysDown`);
                }
            });
        }
    }

    handlePrintFormButton() {
        document.getElementById('formSubmit').addEventListener('click', () => {
            this.pseudoUpdateDays();
        }, { once: true });
    }

    enforceTeamBalance(teamNum) {
        const MAX_TEAM_COUNT = 4;
        if (this.teamCounts[teamNum] >= MAX_TEAM_COUNT) {
            document.getElementById(`joinTeam.${teamNum}`).disabled = true;
        }
        if (this.teamCounts[1] >= MAX_TEAM_COUNT && this.teamCounts[2] >= MAX_TEAM_COUNT && this.teamCounts[3] >= MAX_TEAM_COUNT && this.teamCounts[4] >= MAX_TEAM_COUNT) {
            for (let i = 0; i < this.teamCounts.length; i++) {
                document.getElementById(`joinTeam.${this.teamCounts[i]}`).disabled = false;
            }
        }
    }

    validate() {
        document.addEventListener('change', () => {
            let form = document.getElementById('rosterForm');
            let valid = true;
            if (this.isWeekend && this.dayNight === 'Day') {
                for (let i = 0; i < form.elements.length; i++) {
                    if (form.elements[i].hasAttribute("required") && !form.elements[i].value) {
                        valid = false;
                    }
                }
                if (valid) {
                    for (let button of this.buttons) {
                        document.getElementById(button.id).disabled = false;
                    }
                    let validLeader = document.getElementById('radioNum.6.1');
                    if (validLeader) {
                        if (validLeader.value) {
                            document.getElementById('formSubmit').disabled = false;
                            console.log(`Calling print button....`);
                            this.handlePrintFormButton();
                        }
                    }
                }
            } else {
                for (let i = 0; i < form.elements.length; i++) {
                    if (form.elements[i].hasAttribute("required") && !form.elements[i].value) {
                        valid = false;
                    }
                }
                if (valid) {
                    document.getElementById('joinTeam.0').disabled = false;
                    document.getElementById('formSubmit').disabled = false;
                    this.handlePrintFormButton();
                }
            }
        });
    }

    pseudoUpdateDays() {
        for (let i = 0; i < this.patrollers.length; i++) {
            for (let j = 0; j < this.signedIn.length; j++) {
                if (Number(this.patrollers[i].ID) === Number(this.signedIn[j].ID)) {
                    console.log(this.patrollers[i].LAST_NAME);console.log(this.signedIn[j].LAST_NAME);
                    console.log(this.patrollers[i].HALF_DAYS);console.log(this.signedIn[j].HALF_DAYS);
                    this.patrollers[i].DAYS = this.signedIn[j].DAYS;
                    this.patrollers[i].NIGHTS = this.signedIn[j].NIGHTS;
                    this.patrollers[i].HALF_DAYS = this.signedIn[j].HALF_DAYS;
                    console.log(this.patrollers[i].HALF_DAYS);console.log(this.signedIn[j].HALF_DAYS);
                    this.signedIn.splice(this.signedIn[j], 1);
                    break;
                }
            }
        }
        console.log(this.patrollers);
        fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(this.patrollers),
            headers: {
                'x-requested-with': `fetch.1`,
                'mode': 'no-cors'
            }
        }).then((response) => {
            return response.json();
        });
    }
}

/* enforceTeamBalance2(teamNum) {
        const MAX_TEAM_COUNT = 4;
        if (this.teamCounts[teamNum] < MAX_TEAM_COUNT) {
            this.validate();
        } else if (this.teamCounts[1] >= MAX_TEAM_COUNT && this.teamCounts[2] >= MAX_TEAM_COUNT && this.teamCounts[3] >= MAX_TEAM_COUNT && this.teamCounts[4] >= MAX_TEAM_COUNT) {
            const NUM_TEAMS = 4;
            for (let i = 1; i <= NUM_TEAMS; i++) {
                this.validate();
            }
        } else {
            this.validate(teamNum);
        }
    }*/

/*set Leaders(leader) {
    Object.assign(this.leaders, (leader)); // https://stackoverflow.com/a/47116829
}*/

/*static disableExisting() {
        let form = document.getElementById(`rosterForm`);
        let elements = form.getElementsByClassName(`submitInclude`); // To exclude the submit button
        for (let i = 0; i < elements.length; i++) {
            if (/^((?!\.6\.).)*$/g.test(elements[i].id) && /^((?!team).)*$/g.test(elements[i].id)) {
                if (elements[i] !== `<input type='submit' id='formSubmit' value='PRINT ROSTER' class="button large expanded border">`) {
                    elements[i].disabled = true;
                }
            }
        }
    }*/

/*handleTeamButtons(teamNum) {
        let counter = 1;
        const TEAMS = {
            DAY: 4,
            CANDIDATES: 5,
            LEADERS: 6
        };
        const START_CHILDREN = 5;
        if (teamNum < TEAMS.LEADERS) {
            document.getElementById(`joinTeam.${teamNum}`).addEventListener('click', () => {
                if (teamNum <= TEAMS.DAY) {
                    if (document.getElementById(`team${teamNum}`).childNodes.length === START_CHILDREN || document.getElementById(`patrollerID.${teamNum}.${counter - 1}`).value !== '') {
                        document.getElementById(`team${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDayDivs(teamNum, counter));
                        this.handleHalfDay(teamNum, counter, 'regular');
                        this.changePatrollerDiv(teamNum, counter);
                        counter++;
                    }
                } else if (teamNum === TEAMS.CANDIDATES) {
                    if (document.getElementById(`team${teamNum}`).childNodes.length === START_CHILDREN || document.getElementById(`patrollerID.${teamNum}.${counter - 1}`).value !== '') {
                        document.getElementById(`team${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDayCandidateDivs(teamNum, counter));
                        this.handleHalfDay(teamNum, counter, 'candidate');
                        this.changePatrollerDiv(teamNum, counter);
                        counter++;
                    }
                }
            });
        } else {
            let leaderNum = 0;
            let t6counter = 1;
            while (leaderNum < TEAMS.LEADERS) {
                document.getElementById(`team${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDayLeaderDivs(teamNum, t6counter, leaderNum));
                leaderNum++;
                t6counter++;
            }
            this.changeLeaderDiv();
        }
    }*/

/*changeLeaderDiv() {
    this.handleHalfDay(6, 1, 'regular');
    document.getElementById(`patrollerID.6.1`).addEventListener('change', () => {
        if (document.getElementById(`patrollerID.6.1`).value !== '') {
            if (this.signedIn.length > 0) {
                if (Number(document.getElementById(`patrollerID.6.1`).value) !== this.leaders.PD) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.6.1`).value = '';
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.1`).value)) {
                            this.populateDiv(6, 1, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            document.getElementById(`radioNum.6.1`).setAttribute(`required`, `required`);
                            document.getElementById(`radioNum.6.1`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.1`).value, `radio`);
                            });
                            document.getElementById(`guest.6.1`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.1`).value, `guest`);
                            });
                            this.handlePrintFormButton(this.leaders);
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.1`).value)) {
                        this.populateDiv(6, 1, i);
                        document.getElementById("formSubmit").disabled = false;
                        document.getElementById("formSubmit").classList.remove('disabled');
                        document.getElementById(`radioNum.6.1`).required = true;
                        document.getElementById(`radioNum.6.1`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.1`).value, `radio`);
                        });
                        document.getElementById(`guest.6.1`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.1`).value, `guest`);
                        });
                        this.handlePrintFormButton(this.leaders);
                        break;
                    }
                }
            }
        } else {
            this.clearDiv(6, 1);
        }
    });
    this.handleHalfDay(6, 2, 'regular');
    document.getElementById(`patrollerID.6.2`).addEventListener('change', () => {
        if (document.getElementById(`patrollerID.6.2`).value !== '') {
            if (this.signedIn.length > 0) {
                if (Number(document.getElementById(`patrollerID.6.2`).value) !== this.leaders.APD1 && Number(document.getElementById(`patrollerID.6.2`).value) !== this.leaders.APD2 && Number(document.getElementById(`patrollerID.6.2`).value) !== this.leaders.APD3) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.6.2`).value = '';
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.2`).value)) {
                            this.populateDiv(6, 2, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            document.getElementById(`radioNum.6.2`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.2`).value, `radio`);
                            });
                            document.getElementById(`guest.6.2`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.2`).value, `guest`);
                            });
                            this.handlePrintFormButton(this.leaders);
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.2`).value)) {
                        this.populateDiv(6, 2, i);
                        document.getElementById("formSubmit").disabled = false;
                        document.getElementById("formSubmit").classList.remove('disabled');
                        document.getElementById(`radioNum.6.1`).required = true;
                        document.getElementById(`radioNum.6.2`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.2`).value, `radio`);
                        });
                        document.getElementById(`guest.6.2`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.2`).value, `guest`);
                        });
                        this.handlePrintFormButton(this.leaders);
                        break;
                    }
                }
            }
        } else {
            this.clearDiv(6, 2);
        }
    });
    this.handleHalfDay(6, 3, 'regular');
    document.getElementById(`patrollerID.6.3`).addEventListener('change', () => {
        if (document.getElementById(`patrollerID.6.3`).value !== '') {
            if (this.signedIn.length > 0) {
                if (Number(document.getElementById(`patrollerID.6.3`).value) !== this.leaders.APD1 && Number(document.getElementById(`patrollerID.6.3`).value) !== this.leaders.APD2 && Number(document.getElementById(`patrollerID.6.3`).value) !== this.leaders.APD3) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.6.3`).value = '';
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.3`).value)) {
                            this.populateDiv(6, 3, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.3`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.3`).value, `radio`);
                            });
                            document.getElementById(`guest.6.3`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.3`).value, `guest`);
                            });
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.3`).value)) {
                        this.populateDiv(6, 3, i);
                        document.getElementById("formSubmit").disabled = false;
                        document.getElementById("formSubmit").classList.remove('disabled');
                        document.getElementById(`radioNum.6.1`).required = true;
                        this.handlePrintFormButton(this.leaders);
                        document.getElementById(`radioNum.6.3`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.3`).value, `radio`);
                        });
                        document.getElementById(`guest.6.3`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.3`).value, `guest`);
                        });
                        break;
                    }
                }
            }
        } else {
            this.clearDiv(6, 3);
        }
    });
    this.handleHalfDay(6, 4, 'regular');
    document.getElementById(`patrollerID.6.4`).addEventListener('change', () => {
        if (document.getElementById(`patrollerID.6.4`).value !== '') {
            if (this.signedIn.length > 0) {
                if (Number(document.getElementById(`patrollerID.6.4`).value) !== this.leaders.APD1 && Number(document.getElementById(`patrollerID.6.4`).value) !== this.leaders.APD2 && Number(document.getElementById(`patrollerID.6.4`).value) !== this.leaders.APD3) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.6.4`).value = '';
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.4`).value)) {
                            this.populateDiv(6, 4, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.4`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.4`).value, `radio`);
                            });
                            document.getElementById(`guest.6.4`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.4`).value, `guest`);
                            });
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.4`).value)) {
                        this.populateDiv(6, 4, i);
                        document.getElementById("formSubmit").disabled = false;
                        document.getElementById("formSubmit").classList.remove('disabled');
                        document.getElementById(`radioNum.6.1`).required = true;
                        this.handlePrintFormButton(this.leaders);
                        document.getElementById(`radioNum.6.4`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.4`).value, `radio`);
                        });
                        document.getElementById(`guest.6.4`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.4`).value, `guest`);
                        });
                        break;
                    }
                }
            }
        } else {
            this.clearDiv(6, 4);
        }
    });
    this.handleHalfDay(6, 5, 'regular');
    document.getElementById(`patrollerID.6.5`).addEventListener('change', () => {
        if (document.getElementById(`patrollerID.6.5`).value !== '') {
            if (this.signedIn.length > 0) {
                if (Number(document.getElementById(`patrollerID.6.5`).value) !== this.leaders.TR1 || Number(document.getElementById(`patrollerID.6.5`).value) !== this.leaders.TR2) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.6.5`).value = '';
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.5`).value)) {
                            this.populateDiv(6, 5, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.5`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.5`).value, `radio`);
                            });
                            document.getElementById(`guest.6.5`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.5`).value, `guest`);
                            });
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.5`).value)) {
                        this.populateDiv(6, 5, i);
                        document.getElementById("formSubmit").disabled = false;
                        document.getElementById("formSubmit").classList.remove('disabled');
                        document.getElementById(`radioNum.6.1`).required = true;
                        this.handlePrintFormButton(this.leaders);
                        document.getElementById(`radioNum.6.5`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.5`).value, `radio`);
                        });
                        document.getElementById(`guest.6.5`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.5`).value, `guest`);
                        });
                        break;
                    }
                }
            }
        } else {
            this.clearDiv(6, 5);
        }
    });
    this.handleHalfDay(6, 6, 'regular');
    document.getElementById(`patrollerID.6.6`).addEventListener('change', () => {
        if (document.getElementById(`patrollerID.6.6`).value !== '') {
            if (this.signedIn.length > 0) {
                if (Number(document.getElementById(`patrollerID.6.6`).value) !== this.leaders.TR1 || Number(document.getElementById(`patrollerID.6.6`).value) !== this.leaders.TR2) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.6.6`).value = '';
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.6`).value)) {
                            this.populateDiv(6, 6, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.6`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.6`).value, `radio`);
                            });
                            document.getElementById(`guest.6.6`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.6`).value, `guest`);
                            });
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.6.6`).value)) {
                        this.populateDiv(6, 6, i);
                        document.getElementById("formSubmit").disabled = false;
                        document.getElementById("formSubmit").classList.remove('disabled');
                        document.getElementById(`radioNum.6.1`).required = true;
                        this.handlePrintFormButton(this.leaders);
                        document.getElementById(`radioNum.6.6`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.6.6`).value, `radio`);
                        });
                        document.getElementById(`guest.6.6`).addEventListener('change', () => {
                            this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.6.6`).value, `guest`);
                        });
                        break;
                    }
                }
            }
        } else {
            this.clearDiv(6, 6);
        }
    });
}*/