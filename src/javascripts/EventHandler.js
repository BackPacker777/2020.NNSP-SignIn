import DivContents from "./DivContents2.js";
import WebStorage from "./WebStorage.js";
import narniaAdjustShiftCounts from "./narniaAdjustShiftCounts.js";
import narniaRecreateShift from "./narniaRecreateShift.js";

export default class EventHandler {
    #realDate;
    #realTime;

    constructor(patrollers, SIGN_OFFS) {
        this.SIGN_OFFS = SIGN_OFFS;
        this.nightCounter = 0;
        this.signedIn = [];
        this.patrollers = patrollers;
        this.dayNight = '';
        this.halfDay = false;
        // this.overMax = [false, false, false, false, false];
        // this.teamCounts = [0,0,0,0,0];
        this.counter = [1,1,1,1,1,1,1];
        this.isWeekend = '';
        this.populated = 0;
        this.extraNight = false;
        this.isAdmin = false;
        this.isLocalStorage = false;
        this.#realDate = null;
        this.#realTime = null;
        this.buttons = document.querySelectorAll("input[type=button]");
        this.handleNarnia();
        // new NarniaEventHandler(this.patrollers, this.SIGN_OFFS);
        this.handleFixButton();
        this.handleWhichForm();
        this.handleSignOnButtons();
        EventHandler.stopNaughtyKeys();
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
                /*document.querySelectorAll('input[name="formDisplay"]').forEach((element) => {
                    element.removeEventListener("change", removeMe);
                    element.disabled = true;
                });*/
                let item = event.target.value;
                // console.log(item);
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
                    document.getElementById("dayNight").innerText = `Day Shift`;
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
                    document.getElementById("dayNight").innerText = `Day Shift`;
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
                        DivContents.getDivs(0, counter, null, RACE_TIMES, false);
                        document.getElementById(`joinNight.${counter}`).addEventListener('click', this.removeMe = (event) =>  {
                            let button = Number(event.target.id.substr(10, 1));
                            document.getElementById(`joinTeam.0`).disabled = true;
                            this.throwModal(0, button);
                        });
                        document.getElementById(`patrollerID.0.${counter}`).disabled = true;
                        document.getElementById(`radioNum.0.${counter}`).disabled = true;
                        document.getElementById(`guest.0.${counter}`).disabled = true;
                        counter++;
                    }
                    document.getElementById(`patrollerID.0.1`).required = true;
                    document.getElementById(`joinTeam.0`).value = "EXTRA Sign On (! ONLY click this if all race time slots are filled or you cannot do race course duty !)";
                    document.getElementById("dayNight").innerText = `Night Shift`;
                }
                document.getElementById('chooser').style.display = 'none';
                document.getElementById('chosen').style.display = 'block';
                WebStorage.populateLocalStorage(null, null, item);
            });
        });
    }

    handleSignOnButtons() {
        let nightCounter = 9;
        const LEADERS = 6, CANDIDATES = 5, NIGHT = 0, MODAL_NUM = 7;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].addEventListener('click', (event) => {
                // console.log(this.populated);
                let teamNum = Number(this.buttons[i].id.substr(9, 1));
                if (teamNum === LEADERS && this.populated === 0) {
                    let isLeader = false;
                    let password = prompt(`What is your Patroller ID?`);
                    for (let person of this.patrollers) {
                        if (person.ID === password && person.LEADER) {
                            isLeader = true;
                            document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, this.counter[teamNum], person.LEADER));
                            this.throwModal(LEADERS, this.counter[LEADERS]);
                            document.getElementById(`patrollerID.7.1`).value = person.ID;
                            document.getElementById(`halfDay.${teamNum}.${this.counter[teamNum]}`).addEventListener('click', (event) => {
                                // console.log(event.target.id.substring(10,11));
                                this.handleHalfDay(event.target.id.substring(8,9), event.target.id.substring(10,11));
                            });
                            this.handleUndo(teamNum, this.counter[teamNum]);
                            // this.changePatrollerDiv(LEADERS, this.counter[LEADERS]);
                            let event = new Event('change');
                            document.getElementById(`patrollerID.7.1`).dispatchEvent(event);
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
                    this.extraNight = true;
                    this.throwModal(teamNum, nightCounter);
                    nightCounter++;
                } else {
                    document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, this.counter[teamNum]));
                    if (!this.isAdmin || this.populated === 1) {
                        // console.log(`halfDay.${teamNum}.${this.counter[teamNum]}`);
                        document.getElementById(`halfDay.${teamNum}.${this.counter[teamNum]}`).addEventListener('click', (event) => {
                            // console.log(event.target.id.substring(10,11));
                            this.handleHalfDay(event.target.id.substring(8,9), event.target.id.substring(10,11));
                        });
                    }
                    if (teamNum > 0) {
                        this.handleUndo(teamNum, this.counter[teamNum]);
                    }
                    if (!this.isAdmin) {
                        // console.log('not admin');
                        document.getElementById(`joinTeam.${teamNum}`).disabled = true;
                        this.throwModal(teamNum, this.counter[teamNum]);
                    }
                    if (this.populated === 1 && teamNum !== 0) {
                        this.handleAdmin(teamNum, this.counter[teamNum]);
                        // console.log(this.counter);
                    }
                    if (this.populated === 1) {
                        this.counter[teamNum]++;
                    }
                }
            });
        }
    }

    handleNarnia() {
        document.getElementById(`nspLogo`).addEventListener(`click`, () => {
            let correctPassword = false;
            let password = prompt(`Password: `);
            for (let person of this.patrollers) {
                if (person.ID === password && person.LEADER) {
                    correctPassword = true;
                }
            }
            if (correctPassword) {
                document.getElementById('modalDiv').style.display = 'block';
                document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Choose Task</h3>`);
                document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getNarniaChooseDiv());
                document.getElementById(`fixButton`).classList.add('disabled');
                // document.getElementById(`fixButton`).disabled = true;

                document.getElementById(`adjustShiftsButton`).addEventListener(`click`, () => {
                    document.getElementById("modalTitle").innerHTML = "";
                    document.getElementById("dataEntryDiv").innerHTML = "";
                    new narniaAdjustShiftCounts(this.patrollers, this.signedIn, this.buttons, (results) => {
                        this.signedIn = [];
                        for (let patroller of results) {
                            this.signedIn.push(patroller);
                        }
                        this.updateDays();
                    });
                });

                document.getElementById(`recreateShiftButton`).addEventListener(`click`, () => {
                    document.getElementById("modalTitle").innerHTML = "";
                    document.getElementById("dataEntryDiv").innerHTML = "";
                    new narniaRecreateShift();
                });

            } else {
                alert(`Incorrect Password`);
            }
        });
    }

    throwModal(teamNum, count) {
        const MODAL_NUM = 7, CANDIDATES = 5;
        let correctID = false;
        let patrollerNum;
        let realTeamNum = teamNum;
        let realCount = count;
        document.getElementById('modalDiv').style.display = 'block';
        if (this.dayNight === "Night") {
            document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Joining Night Team</h3>`);
            document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getDivs(MODAL_NUM, 1, null, null, null, true));
        } else if (this.dayNight === "Day" && ! this.isWeekend) {
            document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Joining Weekday Team</h3>`);
            document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getDivs(MODAL_NUM, 1));
        } else if (teamNum < CANDIDATES && teamNum > 0) {
            document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Joining Team: ${teamNum}</h3>`);
            document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getDivs(MODAL_NUM, 1));
        } else if (teamNum === CANDIDATES) {
            document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Joining Team: CANDIDATES/AUXILIARY/ALUMNI</h3>`);
            document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getDivs(MODAL_NUM, 1, null, null, true));
        } else {
            document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Joining Team: LEADERSHIP/TRAINERS</h3>`);
            document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getDivs(MODAL_NUM, 1));
        }
        document.getElementById('modalSubmitButton').disabled = true;
        document.getElementById(`fixButton`).classList.add('disabled');
        document.getElementById(`nspLogo`).classList.add('disabled');
        document.getElementById(`patrollerID.7.1`).focus();
        if (this.dayNight !== "Night") {
            document.getElementById('halfDay.7.1').addEventListener('click', () => {
                if (teamNum === CANDIDATES) {
                    this.handleHalfDay(MODAL_NUM, 1, true);
                } else {
                    this.handleHalfDay(MODAL_NUM, 1, false);
                }
            });
        }
        document.getElementById('modalCancelButton').addEventListener('click', () => {
            document.getElementById(`fixButton`).classList.remove('disabled');
            document.getElementById(`nspLogo`).classList.remove('disabled');
            this.handleUndo(realTeamNum, realCount, MODAL_NUM);
        });
        document.getElementById(`patrollerID.7.1`).addEventListener('change', () => {
            if (document.getElementById(`patrollerID.7.1`).value !== '') {
                for (let i = 0; i < this.patrollers.length; i++) {
                    if (i < this.signedIn.length && Number(this.signedIn[i].ID) === Number(document.getElementById(`patrollerID.7.1`).value)) {
                        alert(`You are already logged in.`);
                        document.getElementById(`patrollerID.7.1`).value = '';
                        break;
                    } else if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.7.1`).value)) {
                        patrollerNum = i;
                        correctID = true;
                        this.completeDivChange(MODAL_NUM, 1, patrollerNum);
                        document.getElementById(`radioNum.7.1`).required = true;
                        document.getElementById(`radioNum.7.1`).addEventListener('change', () => {
                            if (this.validateRadio(7, 1)) {
                                document.getElementById('modalSubmitButton').disabled = false;
                            }
                        });
                        break;
                    }
                }
                if (correctID !== true) {
                    alert(`Invalid ID number. Please try again...`);
                    document.getElementById(`patrollerID.7.1`).value = '';
                } else if (MODAL_NUM) {
                    document.getElementById('modalSubmitButton').addEventListener('click', () => {
                        document.getElementById('formSubmit').disabled = false;
                        document.getElementById(`fixButton`).classList.remove('disabled');
                        document.getElementById(`nspLogo`).classList.remove('disabled');
                        for (let button of this.buttons) {
                            document.getElementById(button.id).disabled = false;
                        }
                        this.divTransition = true;
                        this.changePatrollerDiv(realTeamNum, realCount, patrollerNum);
                        this.handlePrintFormButton();
                    });
                }
            } else {
                this.clearDiv(MODAL_NUM, 1);
            }
        });
    }

    changePatrollerDiv(teamNum, count, patrollerNum) {
        const CANDIDATES = 5, MODAL_NUM = 7, MAX_NIGHT = 8;
        // console.log(`team=${teamNum}, count=${count}, patrollerNum=${patrollerNum}`);
        document.getElementById(`patrollerID.${teamNum}.${count}`).value = document.getElementById(`patrollerID.7.1`).value;
        document.getElementById(`name.${teamNum}.${count}`).value = document.getElementById(`name.7.1`).value;
        document.getElementById(`radioNum.${teamNum}.${count}`).value = document.getElementById(`radioNum.7.1`).value;
        document.getElementById(`rating.${teamNum}.${count}`).value = document.getElementById(`rating.7.1`).value;
        document.getElementById(`time.${teamNum}.${count}`).value = document.getElementById(`time.7.1`).value;
        if (this.dayNight !== "Night") {
            if (document.getElementById(`halfDay.7.1`).checked) {
                document.getElementById(`halfDay.${teamNum}.${count}`).checked = true;
                if (teamNum !== CANDIDATES) {
                    document.getElementById(`guest.${teamNum}.${count}`).disabled = true;
                }
            } else {
                document.getElementById(`halfDay.${teamNum}.${count}`).checked = false;
            }
            /*document.getElementById(`halfDay.${teamNum}.${count}`).addEventListener('click', () => {
                this.handleHalfDay(teamNum, count);
            });*/
        } else if (this.dayNight === "Night" && count <= MAX_NIGHT) {
            document.getElementById(`joinNight.${count}`).classList.add("disabled");
            document.getElementById(`joinNight.0.${count}`).innerHTML = '';
        }
        if (teamNum !== CANDIDATES) {
            document.getElementById(`guest.${teamNum}.${count}`).value = document.getElementById(`guest.7.1`).value;
            this.updatePatrollerInfo(document.getElementById(`patrollerID.7.1`).value, document.getElementById("guest.7.1").value, "guest");
            document.getElementById(`guest.${teamNum}.${count}`).addEventListener('change', () => {
                this.updatePatrollerInfo(this.patrollers[patrollerNum].ID, document.getElementById(`guest.${teamNum}.${count}`).value, `guest`);
            });
            document.getElementById(`guest.${teamNum}.${count}`).disabled = false;
        }
        document.getElementById(`radioNum.${teamNum}.${count}`).addEventListener('change', () => {
            if (this.validateRadio(teamNum, count)) {
                this.updatePatrollerInfo(this.patrollers[patrollerNum].ID, document.getElementById(`radioNum.${teamNum}.${count}`).value, `radio`);
            }
        });
        document.getElementById("modalTitle").innerHTML = "";
        document.getElementById("dataEntryDiv").innerHTML = "";
        document.getElementById('modalDiv').style.display = 'none';
        document.getElementById(`radioNum.${teamNum}.${count}`).disabled = false;
        this.completeDivChange(teamNum, count, patrollerNum);
    }

    completeDivChange(teamNum, count, patrollerNum) {
        let days = Number(this.patrollers[patrollerNum].DAYS);
        let nights = Number(this.patrollers[patrollerNum].NIGHTS);
        let halfDays = Number(this.patrollers[patrollerNum].HALF_DAYS);
        let halfs = Number(halfDays / 2);
        const MODAL_NUM = 7;
        document.getElementById(`patrollerID.${teamNum}.${count}`).readOnly = true;
        if (this.dayNight !== "Night") {
            days++;
        } else {
            nights++;
        }
        let totalDays = Number(days + nights + halfs);
        // console.log(`days=${days}, nights=${nights}, halfDays=${halfDays}, halfs=${halfs}, totalDays=${totalDays}`);
        if (teamNum === MODAL_NUM) {
            document.getElementById(`days.${teamNum}.${count}`).value = totalDays;
        }
        if (teamNum === MODAL_NUM) {
            this.populateDiv(MODAL_NUM, 1, patrollerNum, days, nights, halfDays, totalDays);
        } else {
            this.populateDiv(teamNum, count, patrollerNum, days, nights, halfDays, totalDays);
            if (this.dayNight !== "Night") {
                this.handleHalfDay(teamNum, count);
            }
            if (teamNum !== MODAL_NUM) {
                // console.log(`Handling SignOffs ${teamNum}.${count}`);
                this.handleSignOffs(teamNum, count);
            }
            this.divTransition = false;
            if (this.isAdmin) {
                this.isAdmin = false;
            }
        }
        if (this.isWeekend && teamNum !== MODAL_NUM) {
            this.handleAdmin(teamNum, count);
            /*if (teamNum > 0 && teamNum < 6) {
                this.handleAdmin(teamNum, count);
            }*/
        }
        if (this.populated === 0) {
            this.counter[teamNum]++;
        }
        // this.teamCounts[teamNum]++;
    }

    validateRadio(teamNum, count) {
        const MODAL_NUM = 7;
        let valid = false, usedRadio = false;
        for (let peeps of this.signedIn) {
            if (document.getElementById(`radioNum.${teamNum}.${count}`).value === peeps.RADIO && peeps.RADIO !== '0') {
                usedRadio = true;
            }
        }
        if (!document.getElementById(`radioNum.${teamNum}.${count}`).reportValidity()) {
            if (Number(teamNum) === MODAL_NUM) {
                document.getElementById('modalSubmitButton').disabled = true;
            }
        } else if (usedRadio) {
            alert(`Radio already in use....`);
            document.getElementById(`radioNum.${teamNum}.${count}`).value = '';
            document.getElementById('formSubmit').disabled = true;
            if (teamNum === MODAL_NUM) {
                document.getElementById('modalSubmitButton').disabled = true;
            }
        } else {
            valid = true;
            document.getElementById('formSubmit').disabled = false;
            if (teamNum === MODAL_NUM) {
                document.getElementById('modalSubmitButton').disabled = false;
            }
        }
        return valid;
    }

    updatePatrollerInfo(patrollerID, radioGuestDays, whichListener) {
        for (let patroller of this.signedIn) {
            if (Number(patroller.ID) === Number(patrollerID)) {
                if (! this.divTransition) {
                    if (whichListener === `radio`) {
                        patroller.RADIO = radioGuestDays;
                    } else if (whichListener === `guest`) {
                        patroller.GUEST = radioGuestDays;
                    } else if (whichListener === `halfDaysDown`) {
                        this.halfDay = false;
                        patroller.TODAY_HALF = false;
                        patroller.TOTAL_DAYS = radioGuestDays;
                        patroller.DAYS++;
                        if (patroller.HALF_DAYS > 0 && !this.divTransition) {
                            patroller.HALF_DAYS--;
                        }
                    } else if (whichListener === 'halfDaysUp') {
                        this.halfDay = true;
                        patroller.TODAY_HALF = true;
                        patroller.TOTAL_DAYS = radioGuestDays;
                        patroller.HALF_DAYS++;
                        if (patroller.DAYS > 0 && !this.divTransition) {
                            patroller.DAYS--;
                        }
                    } else if (this.dayNight === 'Nights') {
                        patroller.NIGHTS++;
                    } else {
                        // patroller.DAYS++;
                    }
                }
                if (this.populated === 0) {
                    let whichForm = '';
                    if (this.isWeekend) {
                        whichForm = "weekend";
                    } else if (this.dayNight === "Night") {
                        whichForm = "night";
                    } else {
                        whichForm = "weekday";
                    }
                    WebStorage.populateLocalStorage(patroller, patroller.POSITION_TEAM);
                }
                // console.log(`days=${patroller.DAYS}, halfs=${patroller.HALF_DAYS}, nights=${patroller.NIGHTS}`);
                break;
            }
        }
    }

    populateDiv(teamNum, count, patrollerNum, days, nights, halfDays, totalDays) {
        const MODAL_NUM = 7;
        let time = new Date();
        this.#realDate = time.toLocaleDateString();
        this.#realTime = time.toLocaleTimeString();
        let minutes = time.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let race;
        let isHalf = false;
        if (!document.getElementById(`time.${teamNum}.${count}`).value) {
            document.getElementById(`time.${teamNum}.${count}`).value = `${time.getHours()}:${minutes}`;
        }
        if (document.getElementById(`race.${teamNum}.${count}`)) {
            race = document.getElementById(`race.${teamNum}.${count}`).value;
        }
        if (teamNum !== MODAL_NUM && this.dayNight !== "Night") {
            if (document.getElementById(`halfDay.${teamNum}.${count}`).checked === true) {
                isHalf = true;
            }
        }
        if (teamNum !== MODAL_NUM) {
            let patroller = {
                ID: Number(this.patrollers[patrollerNum].ID),
                RADIO: document.getElementById(`radioNum.${teamNum}.${count}`).value,
                NAME: `${this.patrollers[patrollerNum].FIRST_NAME} ${this.patrollers[patrollerNum].LAST_NAME}`,
                LAST_NAME: this.patrollers[patrollerNum].LAST_NAME,
                FIRST_NAME: this.patrollers[patrollerNum].FIRST_NAME,
                LEADER: this.patrollers[patrollerNum].LEADER,
                RATING: this.patrollers[patrollerNum].RATING,
                TIME: document.getElementById(`time.${teamNum}.${count}`).value,
                DAYS: days,
                TEAM: teamNum,
                RACE: race,
                NIGHTS: nights,
                HALF_DAYS: halfDays,
                TOTAL_DAYS: totalDays,
                SNOWMOBILE: Number(this.patrollers[patrollerNum].SNOWMOBILE),
                TOBOGGAN: Number(this.patrollers[patrollerNum].TOBOGGAN),
                SCAVENGER: Number(this.patrollers[patrollerNum].SCAVENGER),
                CPR: Number(this.patrollers[patrollerNum].CPR),
                CHAIR: Number(this.patrollers[patrollerNum].CHAIR),
                OEC: Number(this.patrollers[patrollerNum].OEC),
                TODAY_HALF: isHalf,
                POSITION_TEAM: this.counter[teamNum],
                DATE_TIME: time
            };
            if (teamNum !== 5 && document.getElementById(`guest.${teamNum}.${count}`)) {
                patroller.GUEST = document.getElementById(`guest.${teamNum}.${count}`).value;
            }
            if (this.populated === 0) {
                // alert(`TOTAL SHIFTS: ${patroller.TOTAL_DAYS}`);
            }
            this.signedIn.push(patroller);
            if (teamNum !== MODAL_NUM) {
                this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS);
            }
        }

        document.getElementById(`name.${teamNum}.${count}`).value = `${this.patrollers[patrollerNum].FIRST_NAME} ${this.patrollers[patrollerNum].LAST_NAME}`;
        document.getElementById(`rating.${teamNum}.${count}`).value = this.patrollers[patrollerNum].RATING;
        // document.getElementById(`days.${teamNum}.${count}`).value = this.signedIn[this.signedIn.length - 1].TOTAL_DAYS;
    }

    clearDiv(teamNum, count) {
        const LEADERS = 6, CANDIDATES = 5, MODAL_NUM = 7, MAX_NIGHT = 8;
        let patroller = this.signedIn.findIndex(patroller => patroller.ID === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value));
        this.signedIn.splice(patroller, 1);
        document.getElementById(`name.${teamNum}.${count}`).value = ``;
        document.getElementById(`radioNum.${teamNum}.${count}`).value = ``;
        document.getElementById(`rating.${teamNum}.${count}`).value = ``;
        document.getElementById(`time.${teamNum}.${count}`).value = ``;
        if (this.dayNight !== "Night") {
            document.getElementById(`halfDay.${teamNum}.${count}`).checked = false;
        }
        if (teamNum !== CANDIDATES && teamNum !== MODAL_NUM) {
            document.getElementById(`guest.${teamNum}.${count}`).value = ``;
            localStorage.removeItem(`${teamNum}.${count}.guest`);
        }
        if (teamNum === MODAL_NUM) {
            document.getElementById("modalTitle").innerHTML = "";
            document.getElementById("dataEntryDiv").innerHTML = "";
        } else if (this.dayNight === "Day" || this.dayNight === "Night" && count > MAX_NIGHT) {
            document.getElementById(`person.${teamNum}.${count}`).outerHTML = ''; //https://stackoverflow.com/a/19298575/466246
            this.extraNight = false;
        }
        if (localStorage.getItem(`${teamNum}.${count}.position`)) {
            localStorage.removeItem(`${teamNum}.${count}.position`);
        }
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
        localStorage.removeItem(`${teamNum}.${count}.date_time`);
    }

    handleHalfDay(teamNum, count, modal) {
        let isCandidate = false;
        const MODAL_NUM = 7, CANDIDATES = 5;
        if (Number(teamNum) === CANDIDATES || modal) {
            isCandidate = true;
        }
        let calculateHalf = function () {
            // console.log(`halfDay.${teamNum}.${count}`);
            if (document.getElementById(`halfDay.${teamNum}.${count}`).checked) {
                document.getElementById(`person.${teamNum}.${count}`).style.backgroundColor = 'rgb(247,223,30)';
                if (!isCandidate) {
                    document.getElementById(`guest.${teamNum}.${count}`).value = '';
                    document.getElementById(`guest.${teamNum}.${count}`).disabled = true;
                }
                if (teamNum === MODAL_NUM) {
                    document.getElementById(`days.${teamNum}.${count}`).value = Number(document.getElementById(`days.${teamNum}.${count}`).value - .5);
                } else {
                    if (! this.isLocalStorage) {
                        for (let patroller of this.signedIn) {
                            if (Number(patroller.ID) === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                                this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS, `halfDaysUp`);
                                break;
                            }
                        }
                    }
                }
            } else {
                document.getElementById(`person.${teamNum}.${count}`).style.backgroundColor = 'white';
                if (!isCandidate) {
                    document.getElementById(`guest.${teamNum}.${count}`).disabled = false;
                }
                if (teamNum === MODAL_NUM) {
                    let oldNum = Number(document.getElementById(`days.${teamNum}.${count}`).value);
                    document.getElementById(`days.${teamNum}.${count}`).value = oldNum + .5;
                } else {
                    if (! this.isLocalStorage) {
                        for (let patroller of this.signedIn) {
                            if (Number(patroller.ID) === Number(document.getElementById(`patrollerID.${teamNum}.${count}`).value)) {
                                this.updatePatrollerInfo(patroller.ID, patroller.TOTAL_DAYS, `halfDaysDown`);
                                break;
                            }
                        }
                    }
                }
            }
            /*if (teamNum !== MODAL_NUM) {
                isCandidate = false;
            }*/
        }.bind(this);

        calculateHalf();
    }

    handleSignOffs(teamNum, count) {
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
                        WebStorage.populateLocalStorage(this.signedIn[i], this.signedIn[i].POSITION_TEAM);
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
            // console.log(`patrollerID.${teamNum}.${count}`);
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

    static stopNaughtyKeys() {
        document.onkeydown = function() {
            switch (event.keyCode) {
                case 13 : //Enter
                    event.returnValue = false;
                    return false;
                case 169 : //Return
                    event.returnValue = false;
                    return false;
                case 116 : //F5 button
                    event.returnValue = false;
                    return false;
                case 82 : //R button
                    if (event.ctrlKey){
                        event.returnValue = false;
                        return false;
                    }
            }
        }
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
                window.open('/src/views/results.ejs' + '?x=' + new Date().getTime(), '_blank', 'location=yes,height=900,width=1000,scrollbars=yes,status=yes');
                WebStorage.purgeLocalStorage();
                window.location.href = window.location.href;
            }
        });
    }

    handleAdmin(teamNum, count) {
        const LEADERS = 6, CANDIDATES = 5;
        // console.log(`admin.${teamNum}.${count}`);
        let correctPassword = false;
        document.getElementById(`admin.${teamNum}.${count}`).addEventListener('click', () => {
            this.isAdmin = true;
            let password = prompt(`Password: `);
            for (let person of this.patrollers) {
                if (person.ID === password && person.LEADER) {
                    correctPassword = true;
                }
            }
            if (correctPassword) {
                const MIN_TEAM = 1, MAX_TEAM = 4;
                let team = prompt(`Move to which team?`);
                while (!/^[0-9]+$/.test(team) || team.length !== 1) {
                    alert("You did not enter a number.");
                    team = prompt(`Move to which team?`);
                }
                if (team < MIN_TEAM || team > MAX_TEAM) {
                    alert(`Incorrect team number.`);
                } else if (Number(team) === Number(teamNum)) {
                    alert(`Patroller is already in this team!`);
                } else {
                    // let teamPosition = this.teamCounts[team] + 1;
                    let teamPosition = this.counter[team];
                    // console.log(`teamPosition=${teamPosition}`);
                    let event1 = new Event("click");
                    document.getElementById(`joinTeam.${team}`).dispatchEvent(event1);
                    document.getElementById(`patrollerID.${team}.${teamPosition}`).value = document.getElementById(`patrollerID.${teamNum}.${count}`).value;
                    document.getElementById(`name.${team}.${teamPosition}`).value = document.getElementById(`name.${teamNum}.${count}`).value;
                    document.getElementById(`radioNum.${team}.${teamPosition}`).value = document.getElementById(`radioNum.${teamNum}.${count}`).value;
                    document.getElementById(`rating.${team}.${teamPosition}`).value = document.getElementById(`rating.${teamNum}.${count}`).value;
                    document.getElementById(`time.${team}.${teamPosition}`).value = document.getElementById(`time.${teamNum}.${count}`).value;
                    if (Number(team) === Number(LEADERS)) {
                        document.getElementById(`position.${team}.${teamPosition}`).value = document.getElementById(`position.${teamNum}.${count}`).value;
                    }
                    if (teamNum !== CANDIDATES) {
                        document.getElementById(`guest.${team}.${teamPosition}`).value = document.getElementById(`guest.${teamNum}.${count}`).value;
                    } else {
                        document.getElementById(`guest.${team}.${teamPosition}`).style.display = "none";
                    }
                    if (document.getElementById(`halfDay.${teamNum}.${count}`).checked) {
                        document.getElementById(`halfDay.${team}.${teamPosition}`).checked = true;
                        this.handleHalfDay(team, teamPosition);
                    }
                    document.getElementById(`halfDay.${team}.${teamPosition}`).addEventListener('click', () => {
                        this.handleHalfDay(team, teamPosition);
                    });
                    /*if (teamNum === LEADERS) {
                        document.getElementById(`position.${teamNum}.${count}`).value = ``;
                        localStorage.removeItem(`${teamNum}.${count}.leader`);
                    }*/
                    this.clearDiv(teamNum, count);
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i].ID) === Number(document.getElementById(`patrollerID.${team}.${teamPosition}`).value)) {
                            // console.log(`patrollerNum=${i}`);
                            this.completeDivChange(team, teamPosition, i);
                            break;
                        }
                    }
                    this.updatePatrollerInfo(document.getElementById(`patrollerID.${team}.${teamPosition}`).value, document.getElementById(`radioNum.${team}.${teamPosition}`).value, "radio");
                    this.updatePatrollerInfo(document.getElementById(`patrollerID.${team}.${teamPosition}`).value, document.getElementById(`guestDiv.${team}.${teamPosition}`).value, "guest");
                    for (let button of this.buttons) {
                        document.getElementById(button.id).disabled = false;
                    }
                }
            } else {
                alert(`Incorrect Password`);
            }
        });
    }

    handleUndo(teamNum, count, MODAL_NUM) {
        if (MODAL_NUM) {
            this.clearDiv(teamNum, count);
            this.clearDiv(MODAL_NUM, 1);
            document.getElementById("modalTitle").innerHTML = "";
            document.getElementById("dataEntryDiv").innerHTML = "";
            document.getElementById('modalDiv').style.display = 'none';
            for (let button of this.buttons) {
                document.getElementById(button.id).disabled = false;
            }
        } else {
            document.getElementById(`undo.${teamNum}.${count}`).addEventListener('click', () => {
                this.clearDiv(teamNum, count);
                for (let button of this.buttons) {
                    document.getElementById(button.id).disabled = false;
                }
            });
        }
    }

    populatePage() {
        if (WebStorage.checkLocalStorage()) {
            let event = new Event('change');
            let whichForm = WebStorage.checkWhichForm();
            this.populated = 1;
            if (! document.getElementById("nightOverride").checked === true) {
                this.isAdmin = true;
            }
            this.divTransition = true;
            this.isLocalStorage = true;
            if (whichForm === "weekend") {
                document.getElementById("weekendOverride").checked = true;
                document.getElementById("weekendOverride").dispatchEvent(event);
            } else if (whichForm === "weekday") {
                document.getElementById("weekdayOverride").checked = true;
                document.getElementById("weekdayOverride").dispatchEvent(event);
            } else {
                document.getElementById("nightOverride").checked = true;
                document.getElementById("nightOverride").dispatchEvent(event);
            }
            this.signedIn = WebStorage.populateForm(whichForm);
            if (this.dayNight === "Night") {
                this.counter[0] = this.signedIn.length + 1;
            }
            WebStorage.purgeLocalStorage();
            WebStorage.populateLocalStorage(null, null, whichForm);
            for (let patroller of this.signedIn) {
                this.handleSignOffs(patroller.TEAM, patroller.POSITION_TEAM);
                WebStorage.populateLocalStorage(patroller, patroller.POSITION_TEAM);
            }
            this.divTransition = false;
            this.isLocalStorage = false;
            this.isAdmin = false;
            this.populated = 0;
            document.getElementById('formSubmit').disabled = false;
            this.handlePrintFormButton();
        }
    }

    updateDays() {
        for (let i = 0; i < this.patrollers.length; i++) {
            for (let j = 0; j < this.signedIn.length; j++) {
                if (Number(this.patrollers[i].ID) === Number(this.signedIn[j].ID)) {
                    this.patrollers[i].DAYS = this.signedIn[j].DAYS;
                    this.patrollers[i].NIGHTS = this.signedIn[j].NIGHTS;
                    this.patrollers[i].HALF_DAYS = this.signedIn[j].HALF_DAYS;
                    this.patrollers[i].SNOWMOBILE = this.signedIn[j].SNOWMOBILE;
                    this.patrollers[i].TOBOGGAN = this.signedIn[j].TOBOGGAN;
                    this.patrollers[i].SCAVENGER = this.signedIn[j].SCAVENGER;
                    this.patrollers[i].CPR = this.signedIn[j].CPR;
                    this.patrollers[i].CHAIR = this.signedIn[j].CHAIR;
                    this.patrollers[i].OEC = this.signedIn[j].OEC;
                    this.patrollers[i].TODAY_HALF = this.signedIn[j].TODAY_HALF;
                    this.patrollers[i].DATE_TIME = this.signedIn[j].DATE_TIME
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
        fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(this.signedIn),
            headers: {
                'x-requested-with': `fetch.5`,
                'mode': 'no-cors'
            }
        }).then((response) => {
            return response.json();
        });
    }
}