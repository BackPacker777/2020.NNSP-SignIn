import DivContents from "./DivContents2.js";
import NarniaEventHandler from "./NarniaEventHandler.js";
import WebStorage from "./WebStorage.js";

export default class EventHandler {
    constructor(patrollers, SIGN_OFFS) {
        this.SIGN_OFFS = SIGN_OFFS;
        this.nightCounter = 0;
        this.signedIn = [];
        this.patrollers = patrollers;
        this.dayNight = '';
        this.halfDay = false;
        this.overMax = [false, false, false, false, false];
        this.teamCounts = [0,0,0,0,0];
        this.counter = [1,1,1,1,1,1,1];
        this.isWeekend = '';
        this.populated = 0;
        this.buttons = document.querySelectorAll("input[type=button]");
        new NarniaEventHandler(this.patrollers, this.SIGN_OFFS);
        this.handleFixButton();
        this.handleWhichForm();
        this.handleSignOnButtons();
        this.validate();
        EventHandler.stopEnterKey();
    }

    handleFixButton() {
        let correctPassword = false;
        document.getElementById(`fixButton`).addEventListener('click', () => {
            let password = prompt(`Password: `);
            for (let person of this.patrollers) {
                if (person.ID === password && person.LEADER) {
                    correctPassword = true;
                }
            }
            if (correctPassword) {
                localStorage.clear();
                location.reload();
                return false;
            } else {
                alert(`Incorrect Password`);
            }
        });
    }

    handleWhichForm() {
        document.querySelectorAll('input[name="formDisplay"]').forEach((element) => {
            let counter = 1;
            let removeMe;
            element.addEventListener("change", removeMe = (event) => {
                document.getElementById('masterDiv').style.display = 'block';
                document.querySelectorAll('input[name="formDisplay"]').forEach((element) => {
                    element.removeEventListener("change", removeMe);
                    element.disabled = true;
                });
                let item = event.target.value;
                if (item === "weekend") {
                    document.getElementById(`team.0`).style.display = 'none';
                    this.isWeekend = true;
                    this.dayNight = "Day";
                    let counter = 1;
                    const MAX_TEAM = 6;
                    while (counter <= MAX_TEAM) {
                        document.getElementById(`team.1`).style.display = 'block';
                        document.getElementById(`team.${counter}`).style.display = 'block';
                        counter++;
                    }
                    document.getElementById('formSubmit').disabled = true;
                } else if (item === "weekday") {
                    document.getElementById(`team.0`).style.display = 'block';
                    this.isWeekend = false;
                    this.dayNight = "Day";
                    const MAX_TEAM = 6;
                    while (counter <= MAX_TEAM) {
                        document.getElementById(`team.${counter}`).style.display = 'none';
                        counter++;
                    }
                    document.getElementById('formSubmit').disabled = true;
                } else {
                    const RACE_TIMES = ['', '7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45'];
                    let teams = document.querySelectorAll("fieldset");
                    this.isWeekend = false;
                    this.dayNight = "Night";
                    for (let i = 1; i < teams.length; i++) {
                        document.getElementById(`team.${i}`).style.display = 'none';
                    }
                    while (counter < RACE_TIMES.length) {
                        document.getElementById(`team.0`).insertAdjacentHTML('beforeend', DivContents.getNightRaceDivs(0, counter, RACE_TIMES));
                        DivContents.getDivs(0, counter, null, RACE_TIMES);
                        this.checkDiv(0, counter);
                        counter++;
                    }
                    document.getElementById(`patrollerID.0.1`).required = true;
                    document.getElementById(`joinTeam.0`).value = "EXTRA Sign On (! ONLY click this if all race time slots are filled or you cannot do race course duty !)";
                }
            });
        });
    }

    /*handleWeekendOverride() {
        if (! this.isWeekend && this.dayNight === 'Day') {
            document.getElementById(`weekendOverride`).addEventListener('click', () => {
                if (document.getElementById(`weekendOverride`).checked) {
                    document.getElementById(`weekendOverrideLabel`).style.backgroundColor = 'yellow';
                    document.getElementById(`weekendOverrideP`).style.backgroundColor = 'yellow';
                    document.getElementById(`team.0`).style.display = 'none';
                    this.isWeekend = true;
                    let counter = 1;
                    const MAX_TEAM = 6;
                    while (counter <= MAX_TEAM) {
                        document.getElementById(`team.1`).style.display = 'block';
                        document.getElementById(`team.${counter}`).style.display = 'block';
                        counter++;
                    }
                    document.getElementById('formSubmit').disabled = true;
                } else {
                    document.getElementById(`weekendOverrideLabel`).style.backgroundColor = `rgb(213, 213, 213)`;
                    document.getElementById(`weekendOverrideP`).style.backgroundColor = `rgb(213, 213, 213)`;
                    document.getElementById(`team.0`).style.display = 'block';
                    this.isWeekend = false;
                    let counter = 1;
                    const MAX_TEAM = 6;
                    while (counter <= MAX_TEAM) {
                        document.getElementById(`team.${counter}`).style.display = 'none';
                        counter++;
                    }
                    document.getElementById('formSubmit').disabled = true;
                }
            });
        } else {
            document.getElementById(`weekendOverride`).disabled = true;
        }
    }*/

    handleSignOnButtons() {
        let nightCounter = 9;
        const LEADERS = 6, CANDIDATES = 5, NIGHT = 0;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].addEventListener('click', () => {
                console.log(this.dayNight);
                let teamNum = Number(this.buttons[i].id.substr(9, 1));
                /*if (teamNum > 0) {
                    for (let button of this.buttons) {

                        // document.getElementById(button.id).disabled = true;
                        document.getElementById('masterDiv').style.display = 'none';
                        document.getElementById('modalDiv').style.display = 'block';
                    }
                }*/
                if (teamNum === LEADERS) {
                    let isLeader = false;
                    let password = prompt(`What is your Patroller ID?`);
                    for (let person of this.patrollers) {
                        if (person.ID === password && person.LEADER) {
                            isLeader = true;
                            /*for (let button of this.buttons) {
                                document.getElementById(button.id).disabled = true;
                            }*/
                            document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, this.counter[teamNum], person.LEADER));
                            document.getElementById(`patrollerID.${LEADERS}.${this.counter[teamNum]}`).value = person.ID;
                            this.handleUndo(teamNum, this.counter[teamNum]);
                            this.throwModal(LEADERS, this.counter[LEADERS]);
                            // this.changePatrollerDiv(LEADERS, this.counter[LEADERS]);
                            if (this.dayNight === 'Day') {
                                this.handleHalfDay(teamNum, this.counter[teamNum]);
                            }
                            let element = document.getElementById(`patrollerID.${LEADERS}.${this.counter[teamNum]}`);
                            let event = new Event('change');
                            element.dispatchEvent(event);
                            this.counter[teamNum]++;
                            break;
                        } else {
                            for (let button of this.buttons) {
                                document.getElementById(button.id).disabled = false;
                            }
                        }
                    }
                    if (!isLeader) {
                        alert(`Incorrect ID for leadership/trainers team. Please try again or sign on to a different team.`);
                    }
                } else if (teamNum === NIGHT && this.dayNight === 'Night') {
                    document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getExtraNightDiv(teamNum, nightCounter));
                    // this.changePatrollerDiv(teamNum, nightCounter);
                    // this.throwModal(teamNum, this.counter[teamNum]);
                    nightCounter++;
                } else {
                    // this.buttons[i].disabled = true;
                    document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, this.teamCounts[teamNum] + 1));
                    /*if (this.dayNight === 'Day') {
                        this.handleHalfDay(teamNum, this.counter[teamNum]);
                    }*/
                    if (teamNum > 0) {
                        this.handleUndo(teamNum, this.counter[teamNum]);
                    }
                    // this.changePatrollerDiv(teamNum, this.counter[teamNum]);
                    this.throwModal(teamNum, this.counter[teamNum]);
                }
            });
        }
    }

    throwModal(teamNum, count) {
        const MODAL_NUM = 7;
        document.getElementById('modalDiv').style.display = 'block';
        document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Joining Team: ${teamNum}</h3>`);
        document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getDivs(MODAL_NUM, 1));
        this.handleHalfDay(MODAL_NUM,1);
        this.checkDiv(MODAL_NUM, 1);
    }

    checkDiv(teamNum, count) {
        const MODAL_NUM = 7;
        let correctID = false;
        let patrollerNum;
        document.getElementById(`patrollerID.${teamNum}.${count}`).addEventListener('change', () => {
            if (document.getElementById(`patrollerID.${teamNum}.${count}`).value !== '') {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (i < this.signedIn.length && this.signedIn[i].ID === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                        alert(`You are already logged in.`);
                        document.getElementById(`patrollerID.${teamNum}.${count}`).value = '';
                        break;
                    } else if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                        correctID = true;
                        this.completeDivChange(teamNum, count, i);
                        document.getElementById(`radioNum.${teamNum}.${count}`).required = true;
                        document.getElementById(`radioNum.${teamNum}.${count}`).addEventListener('change', () => {
                            let usedRadio = false;
                            for (let peeps of this.signedIn) {
                                if (document.getElementById(`radioNum.${teamNum}.${count}`).value === peeps.RADIO && peeps.RADIO !== '0') {
                                    usedRadio = true;
                                }
                            }
                            if (usedRadio) {
                                alert(`Radio already in use....`);
                                document.getElementById(`radioNum.${teamNum}.${count}`).value = '';
                            } else {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.${teamNum}.${count}`).value, `radio`);
                            }
                        });
                        if (teamNum !== 5) {
                            document.getElementById(`guest.${teamNum}.${count}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.${teamNum}.${count}`).value, `guest`);
                            });
                        }
                        break;
                    }
                }
                if (correctID !== true) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.${teamNum}.${count}`).value = '';
                } else if (teamNum === MODAL_NUM) {
                    document.getElementById('modalSubmit').addEventListener('click', () => {
                        this.changePatrollerDiv(teamNum, count, patrollerNum);
                    });
                }
            } else {
                this.clearDiv(teamNum, count);
            }
        });
    }

    changePatrollerDiv(teamNum, count, patrollerNum) {
        console.log(`team=${teamNum}, count=${count}, patrollerNum=${patrollerNum}`);
        if (teamNum === 0) {
            this.checkDiv(teamNum, count)
        }
        document.getElementById(`patrollerID.${teamNum}.${count}`).value = document.getElementById(`patrollerID.7.1`).value;
        document.getElementById(`name.${teamNum}.${count}`).value = document.getElementById(`name.7.1`).value;
        document.getElementById(`radioNum.${teamNum}.${count}`).value = document.getElementById(`radioNum.7.1`).value;
        document.getElementById(`rating.${teamNum}.${count}`).value = document.getElementById(`rating.7.1`).value;
        document.getElementById(`time.${teamNum}.${count}`).value = document.getElementById(`time.7.1`).value;
        if (document.getElementById(`halfDay.7.1`).checked) {
            document.getElementById(`halfDay.${teamNum}.${count}`).checked = true;
        } else {
            document.getElementById(`halfDay.${teamNum}.${count}`).checked = false;
        }
        document.getElementById(`guest.${teamNum}.${count}`).value = document.getElementById(`guest.7.1`).value;
        this.updatePatrollerInfo(document.getElementById(`patrollerID.7.1`).value, document.getElementById("guest.7.1").value, "guest");
        document.getElementById(`radioNum.${teamNum}.${count}`).addEventListener('change', () => {
            this.updatePatrollerInfo(this.patrollers[patrollerNum].ID, document.getElementById(`radioNum.${teamNum}.${count}`).value, `radio`);
        });
        if (teamNum !== 5) {
            document.getElementById(`guest.${teamNum}.${count}`).addEventListener('change', () => {
                this.updatePatrollerInfo(this.patrollers[patrollerNum].ID, document.getElementById(`guest.${teamNum}.${count}`).value, `guest`);
            });
        }
        document.getElementById("modalTitle").innerHTML = "";
        document.getElementById("dataEntryDiv").innerHTML = "";
        document.getElementById('modalDiv').style.display = 'none';
        this.completeDivChange(teamNum, count, patrollerNum);
    }

    /*changePatrollerDivx(teamNum, count) {
        console.log(`patrollerID.${teamNum}.${count}`);
        document.getElementById(`patrollerID.${teamNum}.${count}`).addEventListener('change', () => {
            let correctID = false;
            if (document.getElementById(`patrollerID.${teamNum}.${count}`).value !== '') {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (i < this.signedIn.length && this.signedIn[i].ID === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                        alert(`You are already logged in.`);
                        document.getElementById(`patrollerID.${teamNum}.${count}`).value = '';
                        break;
                    } else if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                        correctID = true;
                        this.completeDivChange(teamNum, i, count);
                        document.getElementById(`radioNum.${teamNum}.${count}`).required = true;
                        document.getElementById(`radioNum.${teamNum}.${count}`).addEventListener('change', () => {
                            let usedRadio = false;
                            for (let peeps of this.signedIn) {
                                if (document.getElementById(`radioNum.${teamNum}.${count}`).value === peeps.RADIO && peeps.RADIO !== '0') {
                                    usedRadio = true;
                                }
                            }
                            if (usedRadio) {
                                alert(`Radio already in use....`);
                                document.getElementById(`radioNum.${teamNum}.${count}`).value = '';
                            } else {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.${teamNum}.${count}`).value, `radio`);
                            }
                        });
                        if (teamNum !== 5) {
                            document.getElementById(`guest.${teamNum}.${count}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.${teamNum}.${count}`).value, `guest`);
                            });
                        }
                        break;
                    }
                }
                if (correctID !== true) {
                    alert(`Invalid ID number. Please try again... Or don't...`);
                    document.getElementById(`patrollerID.${teamNum}.${count}`).value = '';
                }
            } else {
                this.clearDiv(teamNum, count);
            }
        });
    }*/

    completeDivChange(teamNum, count, patrollerNum) {
        console.log(`team=${teamNum}, count=${count}, patrollerNum=${patrollerNum}`);
        const MODAL_NUM = 7;
        document.getElementById(`patrollerID.${teamNum}.${count}`).readOnly = true;
        this.populateDiv(teamNum, patrollerNum, count);
        if (teamNum < MODAL_NUM && this.dayNight !== "Night") {
            this.handleHalfDay(teamNum, count);
            this.handleSignOffs(teamNum, count);
            if (document.getElementById(`halfDay.${teamNum}.${count}`).checked) {
                this.updatePatrollerInfo(this.patrollers[patrollerNum].ID, document.getElementById(`radioNum.${teamNum}.${count}`).value, "halfDaysUp");
            } else {
                this.updatePatrollerInfo(this.patrollers[patrollerNum].ID, document.getElementById(`radioNum.${teamNum}.${count}`).value, "halfDaysDown")
            }
        }
        if (this.isWeekend) {
            if (teamNum > 0 && teamNum < 5) {
                this.handleAdmin(teamNum, count);
            }
        }
        this.counter[teamNum]++;
        this.teamCounts[teamNum]++;
    }

    updatePatrollerInfo(patrollerID, radioGuestDays, whichListener) {
        for (let patroller of this.signedIn) {
            if (Number(patroller.ID) === Number(patrollerID)) {
                if (whichListener === `halfDaysDown`) {
                    patroller.TODAY_HALF = false;
                    patroller.TOTAL_DAYS = radioGuestDays;
                    patroller.DAYS++;
                    if (patroller.HALF_DAYS > 0) {
                        patroller.HALF_DAYS--;
                    }
                    if (this.populated === 0) {
                        alert(`TOTAL DAYS:  ${Number(patroller.TOTAL_DAYS)}`);
                    }
                } else if (whichListener === 'halfDaysUp') {
                    patroller.TODAY_HALF = true;
                    patroller.TOTAL_DAYS = radioGuestDays;
                    patroller.HALF_DAYS++;
                    if (patroller.DAYS > 0) {
                        patroller.DAYS--;
                    }
                    if (this.populated === 0) {
                        alert(`TOTAL DAYS:  ${Number(patroller.TOTAL_DAYS) - .5}`);
                    }
                }
                if (this.populated === 0) {
                    WebStorage.populateLocalStorage(patroller, patroller.POSITION_TEAM);
                }
                break;
            }
        }
    }

    /*updatePatrollerInfox(patrollerID, radioGuestDays, whichListener) {
        for (let patroller of this.signedIn) {
            if (Number(patroller.ID) === Number(patrollerID)) {
                if (whichListener === `radio`) {
                    patroller.RADIO = radioGuestDays;
                } else if (whichListener === `guest`) {
                    patroller.GUEST = radioGuestDays;
                } else if (whichListener === `halfDaysDown`) {
                    patroller.TODAY_HALF = false;
                    patroller.TOTAL_DAYS = radioGuestDays;
                    patroller.DAYS++;
                    if (patroller.HALF_DAYS > 0) {
                        patroller.HALF_DAYS--;
                    }
                    if (this.populated === 0) {
                        alert(`TOTAL DAYS:  ${Number(patroller.TOTAL_DAYS)}`);
                    }
                } else if (whichListener === 'halfDaysUp') {
                    patroller.TODAY_HALF = true;
                    patroller.TOTAL_DAYS = radioGuestDays;
                    patroller.HALF_DAYS++;
                    if (patroller.DAYS > 0) {
                        patroller.DAYS--;
                    }
                    if (this.populated === 0) {
                        alert(`TOTAL DAYS:  ${Number(patroller.TOTAL_DAYS) - .5}`);
                    }
                }
                if (this.populated === 0) {
                    WebStorage.populateLocalStorage(patroller, patroller.POSITION_TEAM);
                }
                break;
            }
        }
        // WebStorage.retrieveLocalStorage();
    }*/

    populateDiv(teamNum, i, count) {
        const MODAL_NUM = 7;
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
        if (! document.getElementById(`time.${teamNum}.${count}`).value) {
            document.getElementById(`time.${teamNum}.${count}`).value = `${time.getHours()}:${minutes}`;
        }
        if (document.getElementById(`race.${teamNum}.${count}`)) {
            race = document.getElementById(`race.${teamNum}.${count}`).value;
        }
        if (teamNum !== MODAL_NUM) {
            this.patrollers[i].DAYS = Number(this.patrollers[i].DAYS);
            this.patrollers[i].NIGHTS = Number(this.patrollers[i].NIGHTS);
            this.patrollers[i].HALF_DAYS = Number(this.patrollers[i].HALF_DAYS);
            let days = this.patrollers[i].DAYS + dayCount;
            let nights = this.patrollers[i].NIGHTS + nightsCount;
            let halfDays = this.patrollers[i].HALF_DAYS + halfDayCount;
            let halfs = halfDays / 2;
            let totalDays = days + nights + halfs;
            let patroller = {
                ID: Number(this.patrollers[i].ID),
                RADIO: document.getElementById(`radioNum.${teamNum}.${count}`).value,
                NAME: `${this.patrollers[i].FIRST_NAME} ${this.patrollers[i].LAST_NAME}`,
                RATING: this.patrollers[i].RATING,
                TIME: document.getElementById(`time.${teamNum}.${count}`).value,
                DAYS: days,
                TEAM: teamNum,
                RACE: race,
                NIGHTS: nights,
                HALF_DAYS: halfDays,
                TOTAL_DAYS: totalDays,
                SNOWMOBILE: this.patrollers[i].SNOWMOBILE,
                TOBOGGAN: this.patrollers[i].TOBOGGAN,
                SCAVENGER: this.patrollers[i].SCAVENGER,
                CPR: this.patrollers[i].CPR,
                CHAIR: this.patrollers[i].CHAIR,
                TODAY_HALF: false,
                POSITION_TEAM: this.counter[teamNum]
            };
            if (teamNum !== 5) {
                patroller.GUEST = document.getElementById(`guest.${teamNum}.${count}`).value;
            }
            if (this.populated === 0) {
                alert(`TOTAL DAYS: ${patroller.TOTAL_DAYS}`);
            }
            this.signedIn.push(patroller);
        }
        document.getElementById(`name.${teamNum}.${count}`).value = `${this.patrollers[i].FIRST_NAME} ${this.patrollers[i].LAST_NAME}`;
        document.getElementById(`rating.${teamNum}.${count}`).value = this.patrollers[i].RATING;
        // document.getElementById(`days.${teamNum}.${count}`).value = this.signedIn[this.signedIn.length - 1].TOTAL_DAYS;
    }

    clearDiv(teamNum, count) {
        console.log(`Team: ${teamNum}, count: ${count}`);
        console.log(this.signedIn);
        let patroller = this.signedIn.findIndex(patroller => patroller.ID === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value));
        this.signedIn.splice(patroller, 1);
        console.log(this.signedIn);
        document.getElementById(`name.${teamNum}.${count}`).value = ``;
        document.getElementById(`radioNum.${teamNum}.${count}`).value = ``;
        document.getElementById(`rating.${teamNum}.${count}`).value = ``;
        document.getElementById(`time.${teamNum}.${count}`).value = ``;
        document.getElementById(`halfDay.${teamNum}.${count}`).checked = false;
        // document.getElementById(`days.${teamNum}.${count}`).value = ``;
        if (teamNum !== 5) {
            document.getElementById(`guest.${teamNum}.${count}`).value = ``;
        }
        document.getElementById(`person.${teamNum}.${count}`).outerHTML = ''; //https://stackoverflow.com/a/19298575/466246
        localStorage.removeItem(`${teamNum}.${count}.cpr`);
        localStorage.removeItem(`${teamNum}.${count}.name`);
        localStorage.removeItem(`${teamNum}.${count}.time`);
        localStorage.removeItem(`${teamNum}.${count}.scavenger`);
        localStorage.removeItem(`${teamNum}.${count}.days`);
        localStorage.removeItem(`${teamNum}.${count}.rating`);
        localStorage.removeItem(`${teamNum}.${count}.id`);
        localStorage.removeItem(`${teamNum}.${count}.todayHalf`);
        localStorage.removeItem(`${teamNum}.${count}.halfDays`);
        localStorage.removeItem(`${teamNum}.${count}.toboggan`);
        localStorage.removeItem(`${teamNum}.${count}.chair`);
        localStorage.removeItem(`${teamNum}.${count}.positionTeam`);
        localStorage.removeItem(`${teamNum}.${count}.radio`);
        localStorage.removeItem(`${teamNum}.${count}.team`);
        localStorage.removeItem(`${teamNum}.${count}.nights`);
        localStorage.removeItem(`${teamNum}.${count}.totalDays`);
        localStorage.removeItem(`${teamNum}.${count}.snowmobile`);
        /*if (this.counter[teamNum] > 1) {
            this.counter[teamNum]--;
        }*/
        /*if (this.teamCounts > 0) {
            this.teamCounts--;
        }*/
    }

    handleHalfDay(teamNum, count) {
        console.log(`Team: ${teamNum}, count: ${count}`);
        // let time = new Date();
        // const DAY_CUTOFF = 9;
        document.getElementById(`halfDay.${teamNum}.${count}`).addEventListener('click', () => {
            if (document.getElementById(`halfDay.${teamNum}.${count}`).checked) {
                document.getElementById(`person.${teamNum}.${count}`).style.backgroundColor = 'rgb(247,223,30)';
                if (teamNum !== 5) {
                    document.getElementById(`guest.${teamNum}.${count}`).disabled = true;
                }
                this.teamCounts[teamNum]--;
                // this.enforceTeamBalance(teamNum);
                /*if (document.getElementById(`days.${teamNum}.${count}`).value > 0) {
                    document.getElementById(`days.${teamNum}.${count}`).value = Number(document.getElementById(`days.${teamNum}.${count}`).value) - .5;
                } else {
                    document.getElementById(`days.${teamNum}.${count}`).value = 0;
                }*/
                for (let patroller of this.signedIn) {
                    if (Number(patroller.ID) === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                        this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS, `halfDaysUp`);
                        break;
                    }
                }

            } else {
                document.getElementById(`person.${teamNum}.${count}`).style.backgroundColor = 'white';
                if (teamNum !== 5) {
                    document.getElementById(`guest.${teamNum}.${count}`).disabled = false;
                }
                this.teamCounts[teamNum]++;
                // this.enforceTeamBalance(teamNum);
                // document.getElementById(`days.${teamNum}.${count}`).value = Number(document.getElementById(`days.${teamNum}.${count}`).value) + .5;
                for (let patroller of this.signedIn) {
                    if (Number(patroller.ID) === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                        this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS, `halfDaysDown`);
                        break;
                    }
                }
                // this.updatePatrollerInfo(document.getElementById(`patrollerID.${teamNum}.${count}`).value, document.getElementById(`days.${teamNum}.${count}`).value, `halfDaysDown`);
            }
        });
    }

    handleSignOffs(teamNum, count) {
        console.log(`Team: ${teamNum}, count: ${count}`);
        let setSignOffs = function(signOff, signOff2, value, patrollers, i) {
            if (value !== 1) {
                document.getElementById(`${signOff}.${teamNum}.${count}`).style.color = 'rgb(204,75,55)';
                let correctPassword = false;
                let removeMe;
                document.getElementById(`${signOff}.${teamNum}.${count}`).addEventListener(`click`, removeMe = () => {
                    let password = prompt(`Password: `);
                    for (let person of patrollers) {
                        if (person.ID === password && person.LEADER) {
                            correctPassword = true;
                        }
                    }
                    if (correctPassword) {
                        this.signedIn[i][signOff2] = 1; // https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
                        document.getElementById(`${signOff}.${teamNum}.${count}`).style.color = 'rgb(23,121,186)';
                        document.getElementById(`${signOff}.${teamNum}.${count}`).removeEventListener('click', removeMe);
                        document.getElementById(`${signOff}.${teamNum}.${count}`).style.cursor = 'default';
                    } else {
                        alert(`Incorrect Password`);
                    }
                });
            } else {
                document.getElementById(`${signOff}.${teamNum}.${count}`).style.color = 'rgb(23,121,186)';
                document.getElementById(`${signOff}.${teamNum}.${count}`).style.cursor = 'default';
            }
        }.bind(this);  // https://stackoverflow.com/questions/346015/javascript-closures-and-this

        for (let i = 0; i < this.signedIn.length; i++) {
            if (Number(this.signedIn[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                setSignOffs("snowmobile", "SNOWMOBILE", Number(this.signedIn[i].SNOWMOBILE), this.patrollers, i);
                setSignOffs("toboggan", "TOBOGGAN", Number(this.signedIn[i].TOBOGGAN), this.patrollers, i);
                setSignOffs("scavenger", "SCAVENGER", Number(this.signedIn[i].SCAVENGER), this.patrollers, i);
                setSignOffs("cpr", "CPR", Number(this.signedIn[i].CPR), this.patrollers, i);
                setSignOffs("chair", "CHAIR", Number(this.signedIn[i].CHAIR), this.patrollers, i);
                break;
            }
        }
    }

    static stopEnterKey() {
        document.addEventListener('keypress', (evt) => {
            let key = evt.which;
            if (key === 13 || key === 169) {
                evt.preventDefault();
            }
        });
    }

    handlePrintFormButton() {
        document.getElementById('formSubmit').addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            let saidYes = prompt(`Are you sure you want to clear & print the roster? Please type:  yes`);
            if (saidYes === 'yes') {
                this.updateDays();
                document.getElementById('formSubmit').disabled = true;
                for (let button of this.buttons) {
                    document.getElementById(button.id).disabled = true;
                }
                window.open('/public/views/results.ejs' + '?x=' + new Date().getTime(), '_blank', 'location=yes,height=900,width=1000,scrollbars=yes,status=yes');
                WebStorage.purgeLocalStorage();
                window.location.href = window.location.href;
            }
        });
    }

    /*enforceTeamBalance(teamNum) {
        if (teamNum > 0) {
            const MAX_TEAM_COUNT = 4;
            if (this.teamCounts[teamNum] >= MAX_TEAM_COUNT) {
                this.overMax[teamNum] = true;
            } else {
                this.overMax[teamNum] = false;
                // document.getElementById(`joinTeam.${teamNum}`).disabled = false;
                // console.log(`Lighting up button.`);
            }
            if (this.teamCounts[1] >= MAX_TEAM_COUNT && this.teamCounts[2] >= MAX_TEAM_COUNT && this.teamCounts[3] >= MAX_TEAM_COUNT && this.teamCounts[4] >= MAX_TEAM_COUNT) {
                for (let i = 1; i < this.overMax.length; i++) {
                    this.overMax[i] = false;
                }
            }
        }
    }*/

    validate() {
        document.addEventListener('change', () => {
            if (window.event.target !== document.getElementById('weekendOverride')) {
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
                        for (let i = 1; i < this.overMax.length; i++) {
                            if (this.overMax[i]) {
                                document.getElementById(`joinTeam.${i}`).disabled = true;
                            }
                        }
                        let validLeader = document.getElementById('radioNum.6.1');
                        if (validLeader) {
                            if (validLeader.value) {
                                document.getElementById('formSubmit').disabled = false;
                                this.handlePrintFormButton();
                            }
                        }

                        /*if (document.getElementById('weekendOverride').value === 'on') {
                            document.getElementById('formSubmit').disabled = false;
                            this.handlePrintFormButton();
                        } else {
                            let validLeader = document.getElementById('radioNum.6.1');
                            if (validLeader) {
                                if (validLeader.value) {
                                    document.getElementById('formSubmit').disabled = false;
                                    this.handlePrintFormButton();
                                }
                            }
                        }*/

                    }
                } else {
                    for (let i = 0; i < form.elements.length; i++) {
                        if (form.elements[i].hasAttribute("required") && !form.elements[i].value) {
                            valid = false;
                        }
                    }
                    if (valid) {
                        // console.log(`valid`);
                        document.getElementById('joinTeam.0').disabled = false;
                        document.getElementById('formSubmit').disabled = false;
                        this.handlePrintFormButton();
                    } //else {
                    //     console.log(`not valid`);
                    // }
                }
            }
        });
    }

    handleAdmin(teamNum, count) {
        console.log(this.signedIn);
        let correctPassword = false;
        document.getElementById(`admin.${teamNum}.${count}`).addEventListener('click', () => {
            let password = prompt(`Password: `);
            for (let person of this.patrollers) {
                if (person.ID === password && person.LEADER) {
                    correctPassword = true;
                }
            }
            if (correctPassword) {
                const MIN_TEAM = 1, MAX_TEAM = 4;
                let team = prompt(`Move to which team?`);
                if (team < MIN_TEAM || team > MAX_TEAM) {
                    alert(`Incorrect team number.`);
                } else if (Number(team) === Number(teamNum)) {
                    alert(`Patroller is already in this team!`);
                } else {
                    let teamPosition = this.teamCounts[team] + 1;
                    console.log(teamPosition);
                    let event1 = new Event("click");
                    document.getElementById(`joinTeam.${team}`).dispatchEvent(event1);
                    document.getElementById(`patrollerID.${team}.${teamPosition}`).value = document.getElementById(`patrollerID.${teamNum}.${count}`).value;
                    document.getElementById(`name.${team}.${teamPosition}`).value = document.getElementById(`name.${teamNum}.${count}`).value;
                    document.getElementById(`radioNum.${team}.${teamPosition}`).value = document.getElementById(`radioNum.${teamNum}.${count}`).value;
                    document.getElementById(`rating.${team}.${teamPosition}`).value = document.getElementById(`rating.${teamNum}.${count}`).value;
                    document.getElementById(`time.${team}.${teamPosition}`).value = document.getElementById(`time.${teamNum}.${count}`).value;
                    document.getElementById(`halfDay.${team}.${teamPosition}`).value = document.getElementById(`halfDay.${teamNum}.${count}`).value;
                    document.getElementById(`guestDiv.${team}.${teamPosition}`).value = document.getElementById(`guestDiv.${teamNum}.${count}`).value;
                    this.clearDiv(teamNum, count);
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.${team}.${teamPosition}`).value)) {
                            this.completeDivChange(team, i, teamPosition);
                            break;
                        }
                    }
                    this.updatePatrollerInfo(document.getElementById(`patrollerID.${team}.${teamPosition}`).value, document.getElementById(`radioNum.${team}.${teamPosition}`).value, "radio");
                    this.updatePatrollerInfo(document.getElementById(`patrollerID.${team}.${teamPosition}`).value, document.getElementById(`guestDiv.${team}.${teamPosition}`).value, "guest");
                    // if (this.counter[teamNum] > 1) {
                    //     this.counter[teamNum]--;
                    // }
                    for (let button of this.buttons) {
                        document.getElementById(button.id).disabled = false;
                    }
                    // this.enforceTeamBalance(team);
                    console.log(this.counter);
                    console.log(this.teamCounts);
                }
            } else {
                alert(`Incorrect Password`);
            }
        });
    }

    handleUndo(teamNum, count) {
        document.getElementById(`undo.${teamNum}.${count}`).addEventListener('click', () => {
            this.clearDiv(teamNum, count);
            for (let button of this.buttons) {
                document.getElementById(button.id).disabled = false;
            }
        });
    }

    populatePage() {
        if (WebStorage.checkLocalStorage()) {
            this.populated = 1;
            WebStorage.populateForm(this.isWeekend, this.dayNight);
        }
        this.validate();
    }

    updateDays() {
        for (let i = 0; i < this.patrollers.length; i++) {
            for (let j = 0; j < this.signedIn.length; j++) {
                if (Number(this.patrollers[i].ID) === Number(this.signedIn[j].ID)) {
                    console.log(`Updating ${this.patrollers[i].LAST_NAME} days....`);
                    this.patrollers[i].DAYS = this.signedIn[j].DAYS;
                    this.patrollers[i].NIGHTS = this.signedIn[j].NIGHTS;
                    this.patrollers[i].HALF_DAYS = this.signedIn[j].HALF_DAYS;
                    console.log(this.signedIn[j].SNOWMOBILE);
                    this.patrollers[i].SNOWMOBILE = this.signedIn[j].SNOWMOBILE;
                    this.patrollers[i].TOBOGGAN = this.signedIn[j].TOBOGGAN;
                    this.patrollers[i].SCAVENGER = this.signedIn[j].SCAVENGER;
                    this.patrollers[i].CPR = this.signedIn[j].CPR;
                    this.patrollers[i].CHAIR = this.signedIn[j].CHAIR;
                    break;
                }
            }
        }
        fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(this.patrollers),
            headers: {
                'x-requested-with': `fetch.1`,
                'mode': 'no-cors'
            }
        }).then((response) => {
            console.log(response.json());
        });
        fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(this.signedIn),
            headers: {
                'x-requested-with': `fetch.2`,
                'mode': 'no-cors'
            }
        }).then((response) => {
            return response.json();
        });
    }
}