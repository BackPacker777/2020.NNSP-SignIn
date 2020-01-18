import DivContents from "./DivContents2.js";
import NarniaEventHandler from "./NarniaEventHandler.js";
import WebStorage from "./WebStorage.js";

export default class EventHandler {
    constructor(patrollers, dayNight, isWeekend, SIGN_OFFS) {
        this.SIGN_OFFS = SIGN_OFFS;
        this.nightCounter = 0;
        this.signedIn = [];
        this.patrollers = patrollers;
        this.dayNight = dayNight;
        this.halfDay = false;
        this.overMax = [false, false, false, false, false];
        this.teamCounts = [0,0,0,0,0];
        this.isWeekend = isWeekend;
        this.populated = 0;
        this.buttons = document.querySelectorAll("input[type=button]");
        new NarniaEventHandler(this.patrollers, this.SIGN_OFFS);
        this.handleWeekendOverride();
        this.handleSignOnButtons();
        this.validate();
        EventHandler.stopEnterKey();
    }

    handleWeekendOverride() {
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
                        // console.log(`Displaying team div team.${counter}`);
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
    }

    handleSignOnButtons() {
        let counter = [1,1,1,1,1,1,1];
        let nightCounter = 9;
        const LEADERS = 6, CANDIDATES = 5, NIGHT = 0;
        for (let i = 0; i < this.buttons.length; i++) {
            let teamNum = Number(this.buttons[i].id.substr(9, 1));
            this.buttons[i].addEventListener('click', () => {
                document.getElementById(`weekendOverride`).disabled = true;
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
                            for (let button of this.buttons) {
                                document.getElementById(button.id).disabled = true;
                            }
                            document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, counter[teamNum], person.LEADER));
                            document.getElementById(`patrollerID.${LEADERS}.${counter[teamNum]}`).value = person.ID;
                            this.handleUndo(teamNum, counter[teamNum]);
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
                    this.changePatrollerDiv(teamNum, nightCounter);
                    nightCounter++;
                } else {
                    this.buttons[i].disabled = true;
                    document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, counter[teamNum]));
                    if (this.dayNight === 'Day') {
                        this.handleHalfDay(teamNum, counter[teamNum]);
                    }
                    this.handleUndo(teamNum, counter[teamNum]);
                    this.changePatrollerDiv(teamNum, counter[teamNum]);
                    counter[teamNum]++;
                }
            });
        }
    }

    changePatrollerDiv(teamNum, counter) {
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
                            document.getElementById(`patrollerID.${teamNum}.${counter}`).readOnly = true;
                            this.populateDiv(teamNum, counter, i);
                            this.handleSnowmobile(teamNum, counter);
                            this.handleToboggan(teamNum, counter);
                            this.handleScavenger(teamNum, counter);
                            this.handleCpr(teamNum, counter);
                            this.handleChair(teamNum, counter);
                            document.getElementById(`radioNum.${teamNum}.${counter}`).required = true;
                            correctID = true;
                            document.getElementById(`radioNum.${teamNum}.${counter}`).addEventListener('change', () => {
                                let usedRadio = false;
                                for (let peeps of this.signedIn) {
                                    if (document.getElementById(`radioNum.${teamNum}.${counter}`).value === peeps.RADIO && peeps.RADIO !== '0') {
                                        usedRadio = true;
                                    }
                                }
                                if (usedRadio) {
                                    alert(`Radio already in use....`);
                                    document.getElementById(`radioNum.${teamNum}.${counter}`).value = '';
                                } else {
                                    this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`radioNum.${teamNum}.${counter}`).value, `radio`);
                                }
                            });
                            if (teamNum !== 5) {
                                document.getElementById(`guest.${teamNum}.${counter}`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i].ID, document.getElementById(`guest.${teamNum}.${counter}`).value, `guest`);
                                });
                            }
                            if (this.isWeekend) {
                                this.teamCounts[teamNum]++;
                                if (teamNum > 0) {
                                    this.enforceTeamBalance(teamNum);
                                }
                                if (teamNum > 0 && teamNum < 5) {
                                    this.handleAdmin(teamNum, counter);
                                }
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
                            document.getElementById(`patrollerID.${teamNum}.${counter}`).readOnly = true;
                            this.populateDiv(teamNum, counter, i);
                            this.handleSnowmobile(teamNum, counter);
                            this.handleToboggan(teamNum, counter);
                            this.handleScavenger(teamNum, counter);
                            this.handleCpr(teamNum, counter);
                            this.handleChair(teamNum, counter);
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
                                if (teamNum > 0) {
                                    this.enforceTeamBalance(teamNum);
                                }
                                if (teamNum > 0 && teamNum < 5) {
                                    this.handleAdmin(teamNum, counter);
                                }
                            }
                            break;
                        }
                    }
                    if (!correctID) {
                        alert(`Invalid ID number. Please try again... Or don't...`);
                        document.getElementById(`patrollerID.${teamNum}.${counter}`).value = '';
                    }
                }
            } else {
                this.clearDiv(teamNum, counter);
            }
        });
    }

    updatePatrollerInfo(patrollerID, radioGuestDays, whichListener) {
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
        if (! document.getElementById(`time.${teamNum}.${counter}`).value) {
            document.getElementById(`time.${teamNum}.${counter}`).value = `${time.getHours()}:${minutes}`;
        }
        if (document.getElementById(`race.${teamNum}.${counter}`)) {
            race = document.getElementById(`race.${teamNum}.${counter}`).value;
        }
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
            RADIO: document.getElementById(`radioNum.${teamNum}.${counter}`).value,
            NAME: `${this.patrollers[i].FIRST_NAME} ${this.patrollers[i].LAST_NAME}`,
            RATING: this.patrollers[i].RATING,
            TIME: document.getElementById(`time.${teamNum}.${counter}`).value,
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
            POSITION_TEAM: counter
        };
        if (teamNum !== 5) {
            patroller.GUEST = document.getElementById(`guest.${teamNum}.${counter}`).value;
        }
        if (this.populated === 0) {
            alert(`TOTAL DAYS: ${patroller.TOTAL_DAYS}`);
        }
        this.signedIn.push(patroller);
        document.getElementById(`name.${teamNum}.${counter}`).value = `${this.patrollers[i].FIRST_NAME} ${this.patrollers[i].LAST_NAME}`;
        document.getElementById(`rating.${teamNum}.${counter}`).value = this.patrollers[i].RATING;
        // document.getElementById(`days.${teamNum}.${counter}`).value = this.signedIn[this.signedIn.length - 1].TOTAL_DAYS;
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
        // document.getElementById(`days.${teamNum}.${counter}`).value = ``;
        if (teamNum !== 5) {
            document.getElementById(`guest.${teamNum}.${counter}`).value = ``;
        }
        document.getElementById(`person.${teamNum}.${counter}`).outerHTML = ''; //https://stackoverflow.com/a/19298575/466246
        this.teamCounts[teamNum]--;
    }

    handleHalfDay(teamNum, counter) {
        let time = new Date();
        const DAY_CUTOFF = 9;
        if (time.getHours() > DAY_CUTOFF) {
            document.getElementById(`halfDay.${teamNum}.${counter}`).setAttribute('checked', 'checked');
            document.getElementById(`halfDay.${teamNum}.${counter}`).disabled = true;
            if (teamNum !== 5) {
                document.getElementById(`guestDiv.${teamNum}.${counter}`).style.visibility = 'hidden';
            }
            this.teamCounts[teamNum]--;
            this.enforceTeamBalance(teamNum);
            /*if (document.getElementById(`days.${teamNum}.${counter}`).value > 0) {
                document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) - .5;
            } else {
                document.getElementById(`days.${teamNum}.${counter}`).value = 0;
            }*/
            for (let patroller of this.signedIn) {
                if (Number(patroller.ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                    this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS, `halfDaysUp`);
                    break;
                }
            }
            // this.updatePatrollerInfo(document.getElementById(`patrollerID.${teamNum}.${counter}`).value, document.getElementById(`days.${teamNum}.${counter}`).value, `halfDaysUp`);
            this.halfDay = true;
        } else {
            document.getElementById(`halfDay.${teamNum}.${counter}`).addEventListener('click', () => {
                if (document.getElementById(`halfDay.${teamNum}.${counter}`).checked) {
                    document.getElementById(`person.${teamNum}.${counter}`).style.backgroundColor = 'rgb(247,223,30)';
                    if (teamNum !== 5) {
                        document.getElementById(`guest.${teamNum}.${counter}`).disabled = true;
                    }
                    this.teamCounts[teamNum]--;
                    this.enforceTeamBalance(teamNum);
                    /*if (document.getElementById(`days.${teamNum}.${counter}`).value > 0) {
                        document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) - .5;
                    } else {
                        document.getElementById(`days.${teamNum}.${counter}`).value = 0;
                    }*/
                    for (let patroller of this.signedIn) {
                        if (Number(patroller.ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                            this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS, `halfDaysUp`);
                            break;
                        }
                    }

                } else {
                    document.getElementById(`person.${teamNum}.${counter}`).style.backgroundColor = 'white';
                    if (teamNum !== 5) {
                        document.getElementById(`guest.${teamNum}.${counter}`).disabled = false;
                    }
                    this.teamCounts[teamNum]++;
                    this.enforceTeamBalance(teamNum);
                    // document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) + .5;
                    for (let patroller of this.signedIn) {
                        if (Number(patroller.ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                            this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS, `halfDaysDown`);
                            break;
                        }
                    }
                    // this.updatePatrollerInfo(document.getElementById(`patrollerID.${teamNum}.${counter}`).value, document.getElementById(`days.${teamNum}.${counter}`).value, `halfDaysDown`);
                }
            });
        }
    }

    handleSnowmobile(teamNum, counter) {
        for (let i = 0; i < this.signedIn.length; i++) {
            if (Number(this.signedIn[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                if (Number(this.signedIn[i].SNOWMOBILE) !== 1) {
                    document.getElementById(`snowmobile.${teamNum}.${counter}`).style.color = 'rgb(204,75,55)';
                    let correctPassword = false;
                    let removeMe;
                    document.getElementById(`snowmobile.${teamNum}.${counter}`).addEventListener(`click`, removeMe = () => {
                        let password = prompt(`Password: `);
                        for (let person of this.patrollers) {
                            if (person.ID === password && person.LEADER) {
                                correctPassword = true;
                            }
                        }
                        if (correctPassword) {
                            this.signedIn[i].SNOWMOBILE = 1;
                            document.getElementById(`snowmobile.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                            document.getElementById(`snowmobile.${teamNum}.${counter}`).removeEventListener("click", removeMe);
                            document.getElementById(`snowmobile.${teamNum}.${counter}`).style.cursor = 'default';
                        } else {
                            alert(`Incorrect Password`);
                        }
                    });
                } else {
                    document.getElementById(`snowmobile.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`snowmobile.${teamNum}.${counter}`).style.cursor = 'default';
                }
                break;
            }
        }
    }

    handleToboggan(teamNum, counter) {
        for (let i = 0; i < this.signedIn.length; i++) {
            if (Number(this.signedIn[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                if (Number(this.signedIn[i].TOBOGGAN) !== 1) {
                    document.getElementById(`toboggan.${teamNum}.${counter}`).style.color = 'rgb(204,75,55)';
                    let correctPassword = false;
                    let removeMe;
                    document.getElementById(`toboggan.${teamNum}.${counter}`).addEventListener(`click`, removeMe = () => {
                        let password = prompt(`Password: `);
                        for (let person of this.patrollers) {
                            if (person.ID === password && person.LEADER) {
                                correctPassword = true;
                            }
                        }
                        if (correctPassword) {
                            this.signedIn[i].TOBOGGAN = 1;
                            document.getElementById(`toboggan.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                            document.getElementById(`toboggan.${teamNum}.${counter}`).removeEventListener("click", removeMe);
                            document.getElementById(`toboggan.${teamNum}.${counter}`).style.cursor = 'default';
                        } else {
                            alert(`Incorrect Password`);
                        }
                    });
                } else {
                    document.getElementById(`toboggan.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`toboggan.${teamNum}.${counter}`).style.cursor = 'default';
                }
                break;
            }
        }
    }

    handleScavenger(teamNum, counter) {
        for (let i = 0; i < this.signedIn.length; i++) {
            if (Number(this.signedIn[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                if (Number(this.signedIn[i].SCAVENGER) !== 1) {
                    document.getElementById(`scavenger.${teamNum}.${counter}`).style.color = 'rgb(204,75,55)';
                    let correctPassword = false;
                    let removeMe;
                    document.getElementById(`scavenger.${teamNum}.${counter}`).addEventListener(`click`, removeMe = () => {
                        let password = prompt(`Password: `);
                        for (let person of this.patrollers) {
                            if (person.ID === password && person.LEADER) {
                                correctPassword = true;
                            }
                        }
                        if (correctPassword) {
                            this.signedIn[i].SCAVENGER = 1;
                            document.getElementById(`scavenger.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                            document.getElementById(`scavenger.${teamNum}.${counter}`).removeEventListener('click', removeMe);
                            document.getElementById(`scavenger.${teamNum}.${counter}`).style.cursor = 'default';
                        } else {
                            alert(`Incorrect Password`);
                        }
                    });
                } else {
                    document.getElementById(`scavenger.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`scavenger.${teamNum}.${counter}`).style.cursor = 'default';
                }
                break;
            }
        }
    }

    handleCpr(teamNum, counter) {
        for (let i = 0; i < this.signedIn.length; i++) {
            if (Number(this.signedIn[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                if (Number(this.signedIn[i].CPR) !== 1) {
                    document.getElementById(`cpr.${teamNum}.${counter}`).style.color = 'rgb(204,75,55)';
                    let correctPassword = false;
                    let removeMe;
                    document.getElementById(`cpr.${teamNum}.${counter}`).addEventListener(`click`, removeMe = () => {
                        let password = prompt(`Password: `);
                        for (let person of this.patrollers) {
                            if (person.ID === password && person.LEADER) {
                                correctPassword = true;
                            }
                        }
                        if (correctPassword) {
                            this.signedIn[i].CPR = 1;
                            document.getElementById(`cpr.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                            document.getElementById(`cpr.${teamNum}.${counter}`).removeEventListener('click', removeMe);
                            document.getElementById(`cpr.${teamNum}.${counter}`).style.cursor = 'default';
                        } else {
                            alert(`Incorrect Password`);
                        }
                    });
                } else {
                    document.getElementById(`cpr.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`cpr.${teamNum}.${counter}`).style.cursor = 'default';
                }
                break;
            }
        }
    }

    handleChair(teamNum, counter) {
        for (let i = 0; i < this.signedIn.length; i++) {
            if (Number(this.signedIn[i].ID) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                if (Number(this.signedIn[i].CHAIR) !== 1) {
                    document.getElementById(`chair.${teamNum}.${counter}`).style.color = 'rgb(204,75,55)';
                    let correctPassword = false;
                    let removeMe;
                    document.getElementById(`chair.${teamNum}.${counter}`).addEventListener(`click`, removeMe = () => {
                        let password = prompt(`Password: `);
                        for (let person of this.patrollers) {
                            if (person.ID === password && person.LEADER) {
                                correctPassword = true;
                            }
                        }
                        if (correctPassword) {
                            this.signedIn[i].CHAIR = 1;
                            document.getElementById(`chair.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                            document.getElementById(`chair.${teamNum}.${counter}`).removeEventListener('click', removeMe);
                            document.getElementById(`chair.${teamNum}.${counter}`).style.cursor = 'default';
                        } else {
                            alert(`Incorrect Password`);
                        }
                    });
                } else {
                    document.getElementById(`chair.${teamNum}.${counter}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`chair.${teamNum}.${counter}`).style.cursor = 'default';
                }
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
            // let saidYes = 'yes';
            console.log(`Print button clicked`);
            if (saidYes === 'yes') {
                this.updateDays();
                document.getElementById('formSubmit').disabled = true;
                for (let button of this.buttons) {
                    document.getElementById(button.id).disabled = true;
                }
                window.open('/public/views/results.ejs', '_blank', 'location=yes,height=900,width=1000,scrollbars=yes,status=yes');
                WebStorage.purgeLocalStorage();
            }
        });
    }

    enforceTeamBalance(teamNum) {
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
    }

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
                        if (document.getElementById('weekendOverride').value === 'on') {
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
                        }
                    }
                } else {
                    for (let i = 0; i < form.elements.length; i++) {
                        if (form.elements[i].hasAttribute("required") && !form.elements[i].value) {
                            valid = false;
                        }
                    }
                    if (valid) {
                        console.log(`valid`);
                        document.getElementById('joinTeam.0').disabled = false;
                        document.getElementById('formSubmit').disabled = false;
                        this.handlePrintFormButton();
                    } else {
                        console.log(`not valid`);
                    }
                }
            }
        });
    }

    handleAdmin(teamNum, counter) {
        let correctPassword = false;
        document.getElementById(`admin.${teamNum}.${counter}`).addEventListener('click', () => {
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
                    let div = document.getElementById(`person.${teamNum}.${counter}`);
                    document.getElementById(`team.${team}`).appendChild(div);
                    this.teamCounts[team]++;
                    this.teamCounts[teamNum]--;
                    this.enforceTeamBalance(team);
                }
            } else {
                alert(`Incorrect Password`);
            }
        });
    }

    handleUndo(teamNum, counter) {
        document.getElementById(`undo.${teamNum}.${counter}`).addEventListener('click', () => {
            this.clearDiv(teamNum, counter);
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