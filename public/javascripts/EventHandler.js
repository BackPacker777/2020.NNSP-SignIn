"use strict";

import DivContents from "./DivContents2.js";

export default class EventHandler {
    constructor(patrollers, dayNight, isWeekend) {
        this.signedIn = [];
        this.patrollers = patrollers;
        this.dayNight = dayNight;
        this.halfDay = false;
        this.leaders = {
            PD: 178647,
            APD1: 128072,
            APD2: 251542,
            APD3: 222222,
            TR1: 178651,
            TR2: 219670
        };
        this.isWeekend = isWeekend;
        this.validate();
    }

    set Leaders(leader) {
        Object.assign(this.leaders, (leader)); // https://stackoverflow.com/a/47116829
    }

    handleSignOnButtons() {
        let counter = 1;
        this.buttons = document.querySelectorAll("input[type=button]");
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].addEventListener('click', () => {
                let teamNum = this.buttons[i].id.substr(9,1);
                if (teamNum === 6) {

                } else {
                    document.getElementById(`team.${teamNum}`).insertAdjacentHTML('beforeend', DivContents.getDivs(teamNum, counter));
                    if (this.halfDay) {
                        this.handleHalfDay(teamNum, counter, 'regular');
                    } else {

                    }
                    this.changePatrollerDiv(teamNum, counter);
                    counter++;
                }
            });
        }
    }

    handleTeamButtons(teamNum) {
        let counter = 1;
        const TEAMS = {
            DAY: 4,
            CANDIDATES: 5,
            LEADERS: 6
        };
        const START_CHILDREN = 5;
        if (teamNum < TEAMS.LEADERS) {
            document.getElementById(`joinTeam${teamNum}`).addEventListener('click', () => {
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
                        } else if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                            this.populateDiv(teamNum, counter, i);
                            document.getElementById(`radioNum.${teamNum}.${counter}`).required = true;
                            correctID = true;
                            document.getElementById(`radioNum.${teamNum}.${counter}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.${teamNum}.${counter}`).value, `radio`);
                            });
                            document.getElementById(`guest.${teamNum}.${counter}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.${teamNum}.${counter}`).value, `guest`);
                            });
                            if (! this.isWeekend) {
                                this.handlePrintFormButton(this.leaders);
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
                        if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.${teamNum}.${counter}`).value)) {
                            this.populateDiv(teamNum, counter, i);
                            document.getElementById(`radioNum.${teamNum}.${counter}`).required = true;
                            correctID = true;
                            document.getElementById(`radioNum.${teamNum}.${counter}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.${teamNum}.${counter}`).value, `radio`);
                            });
                            document.getElementById(`guest.${teamNum}.${counter}`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.${teamNum}.${counter}`).value, `guest`);
                            });
                            if (! this.isWeekend) {
                                this.handlePrintFormButton(this.leaders);
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
    }

    updatePatrollerInfo(patrollerID, radioGuestDays, whichListener) {
        for (let patroller of this.signedIn) {
            if (Number(patroller.ID) === Number(patrollerID)) {
                if (whichListener === `radio`) {
                    patroller.RADIO = radioGuestDays;
                } else if (whichListener === `guest`) {
                    patroller.GUEST = radioGuestDays;
                } else {
                    patroller.DAYS = radioGuestDays;
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
        let dayCount = 1;
        if (this.halfDay === true) {
            dayCount = .5;
        }
        document.getElementById(`time.${teamNum}.${counter}`).value = `${time.getHours()}:${minutes}`;
        if (document.getElementById(`race.${teamNum}.${counter}`)) {
            race = document.getElementById(`race.${teamNum}.${counter}`).value;
        }
        let patroller = {
            ID: Number(this.patrollers[i][0]),
            RADIO: document.getElementById(`radioNum.${teamNum}.${counter}`).value,
            NAME: `${this.patrollers[i][2]} ${this.patrollers[i][1]}`,
            RATING: this.patrollers[i][3],
            TIME: document.getElementById(`time.${teamNum}.${counter}`).value,
            DAYS: Number(this.patrollers[i][4]) + dayCount,
            GUEST: document.getElementById(`guest.${teamNum}.${counter}`).value,
            TEAM: teamNum,
            RACE: race
        };
        this.signedIn.push(patroller);
        document.getElementById(`name.${teamNum}.${counter}`).value = `${this.patrollers[i][2]} ${this.patrollers[i][1]}`;
        document.getElementById(`rating.${teamNum}.${counter}`).value = this.patrollers[i][3];
        document.getElementById(`days.${teamNum}.${counter}`).value = this.signedIn[this.signedIn.length - 1].DAYS;
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
        document.getElementById(`days.${teamNum}.${counter}`).value = ``;
        document.getElementById(`guest.${teamNum}.${counter}`).value = ``;
    }

    changeLeaderDiv() {
        this.handleHalfDay(6, 1, 'regular');
        document.getElementById(`patrollerID.6.1`).addEventListener('change', () => {
            if (document.getElementById(`patrollerID.6.1`).value !== '') {
                if (this.signedIn.length > 0) {
                    if (Number(document.getElementById(`patrollerID.6.1`).value) !== this.leaders.PD) {
                        alert(`Invalid ID number. Please try again... Or don't...`);
                        document.getElementById(`patrollerID.6.1`).value = '';
                    } else {
                        for (let i = 0; i < this.patrollers.length; i++) {
                            if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.1`).value)) {
                                this.populateDiv(6, 1, i);
                                document.getElementById("formSubmit").disabled = false;
                                document.getElementById("formSubmit").classList.remove('disabled');
                                document.getElementById(`radioNum.6.1`).required = true;
                                document.getElementById(`radioNum.6.1`).setAttribute(`required`, `required`);
                                document.getElementById(`radioNum.6.1`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.1`).value, `radio`);
                                });
                                document.getElementById(`guest.6.1`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.1`).value, `guest`);
                                });
                                this.handlePrintFormButton(this.leaders);
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.1`).value)) {
                            this.populateDiv(6, 1, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            document.getElementById(`radioNum.6.1`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.1`).value, `radio`);
                            });
                            document.getElementById(`guest.6.1`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.1`).value, `guest`);
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
                            if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.2`).value)) {
                                this.populateDiv(6, 2, i);
                                document.getElementById("formSubmit").disabled = false;
                                document.getElementById("formSubmit").classList.remove('disabled');
                                document.getElementById(`radioNum.6.1`).required = true;
                                document.getElementById(`radioNum.6.2`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.2`).value, `radio`);
                                });
                                document.getElementById(`guest.6.2`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.2`).value, `guest`);
                                });
                                this.handlePrintFormButton(this.leaders);
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.2`).value)) {
                            this.populateDiv(6, 2, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            document.getElementById(`radioNum.6.2`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.2`).value, `radio`);
                            });
                            document.getElementById(`guest.6.2`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.2`).value, `guest`);
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
                            if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.3`).value)) {
                                this.populateDiv(6, 3, i);
                                document.getElementById("formSubmit").disabled = false;
                                document.getElementById("formSubmit").classList.remove('disabled');
                                document.getElementById(`radioNum.6.1`).required = true;
                                this.handlePrintFormButton(this.leaders);
                                document.getElementById(`radioNum.6.3`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.3`).value, `radio`);
                                });
                                document.getElementById(`guest.6.3`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.3`).value, `guest`);
                                });
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.3`).value)) {
                            this.populateDiv(6, 3, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.3`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.3`).value, `radio`);
                            });
                            document.getElementById(`guest.6.3`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.3`).value, `guest`);
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
                            if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.4`).value)) {
                                this.populateDiv(6, 4, i);
                                document.getElementById("formSubmit").disabled = false;
                                document.getElementById("formSubmit").classList.remove('disabled');
                                document.getElementById(`radioNum.6.1`).required = true;
                                this.handlePrintFormButton(this.leaders);
                                document.getElementById(`radioNum.6.4`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.4`).value, `radio`);
                                });
                                document.getElementById(`guest.6.4`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.4`).value, `guest`);
                                });
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.4`).value)) {
                            this.populateDiv(6, 4, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.4`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.4`).value, `radio`);
                            });
                            document.getElementById(`guest.6.4`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.4`).value, `guest`);
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
                            if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.5`).value)) {
                                this.populateDiv(6, 5, i);
                                document.getElementById("formSubmit").disabled = false;
                                document.getElementById("formSubmit").classList.remove('disabled');
                                document.getElementById(`radioNum.6.1`).required = true;
                                this.handlePrintFormButton(this.leaders);
                                document.getElementById(`radioNum.6.5`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.5`).value, `radio`);
                                });
                                document.getElementById(`guest.6.5`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.5`).value, `guest`);
                                });
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.5`).value)) {
                            this.populateDiv(6, 5, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.5`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.5`).value, `radio`);
                            });
                            document.getElementById(`guest.6.5`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.5`).value, `guest`);
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
                            if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.6`).value)) {
                                this.populateDiv(6, 6, i);
                                document.getElementById("formSubmit").disabled = false;
                                document.getElementById("formSubmit").classList.remove('disabled');
                                document.getElementById(`radioNum.6.1`).required = true;
                                this.handlePrintFormButton(this.leaders);
                                document.getElementById(`radioNum.6.6`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.6`).value, `radio`);
                                });
                                document.getElementById(`guest.6.6`).addEventListener('change', () => {
                                    this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.6`).value, `guest`);
                                });
                                break;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.patrollers.length; i++) {
                        if (Number(this.patrollers[i][0]) === Number(document.getElementById(`patrollerID.6.6`).value)) {
                            this.populateDiv(6, 6, i);
                            document.getElementById("formSubmit").disabled = false;
                            document.getElementById("formSubmit").classList.remove('disabled');
                            document.getElementById(`radioNum.6.1`).required = true;
                            this.handlePrintFormButton(this.leaders);
                            document.getElementById(`radioNum.6.6`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`radioNum.6.6`).value, `radio`);
                            });
                            document.getElementById(`guest.6.6`).addEventListener('change', () => {
                                this.updatePatrollerInfo(this.patrollers[i][0], document.getElementById(`guest.6.6`).value, `guest`);
                            });
                            break;
                        }
                    }
                }
            } else {
                this.clearDiv(6, 6);
            }
        });
    }

    handleHalfDay(teamNum, counter, team) {
        let time = new Date();
        const DAY_CUTOFF = 9;
        if (time.getHours() > DAY_CUTOFF) {
            if (team === 'regular') {
                document.getElementById(`guest.${teamNum}.${counter}`).setAttribute('readonly', '');
            }
            document.getElementById(`halfDay.${teamNum}.${counter}`).setAttribute('disabled', 'disabled');
            document.getElementById(`halfDay.${teamNum}.${counter}`).setAttribute('checked', 'checked');
            this.halfDay = true;
        } else {
            document.getElementById(`halfDay.${teamNum}.${counter}`).addEventListener('click', () => {
                if (team === 'regular') {
                    if (document.getElementById(`halfDay.${teamNum}.${counter}`).checked) {
                        document.getElementById(`guest.${teamNum}.${counter}`).setAttribute('readonly', '');
                        document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) - .5;
                    } else {
                        document.getElementById(`guest.${teamNum}.${counter}`).removeAttribute('readonly');
                        document.getElementById(`days.${teamNum}.${counter}`).value = Number(document.getElementById(`days.${teamNum}.${counter}`).value) + .5;
                    }
                    this.updatePatrollerInfo(document.getElementById(`patrollerID.${teamNum}.${counter}`).value, document.getElementById(`days.${teamNum}.${counter}`).value, `halfDay`);
                }
            });
        }
    }

    handlePrintFormButton() {
        if (! document.getElementById("formSubmit").disabled && this.signedIn.length > 0) {
            let submit;
            document.getElementById('formSubmit').addEventListener('click', submit = () => {
                if (document.getElementById("rosterForm").checkValidity()) {
                    let correct = false;
                    let answer = Number(prompt(`Password?`));
                    for (let key in this.leaders) {
                        if (this.leaders[key] === answer && this.dayNight === `Day`) {
                            correct = true;
                            /*if (this.isWeekend === true) {
                                document.getElementById("formSubmit").disabled = true;
                                document.getElementById("formSubmit").classList.add('disabled');
                                document.getElementById('formSubmit').removeEventListener('click', submit);
                            }*/
                            EventHandler.disableExisting();
                            this.updateDaysCount().then(() => { });
                            window.open('/public/views/day_results.ejs', '_blank', 'location=yes,height=900,width=1000,scrollbars=yes,status=yes');
                            break;
                        } else if (this.leaders[key] === answer && this.dayNight === `Night`) {
                            correct = true;
                            /*if (this.isWeekend === true) {
                                document.getElementById("formSubmit").disabled = true;
                                document.getElementById("formSubmit").classList.add('disabled');
                                document.getElementById('formSubmit').removeEventListener('click', submit);
                            }*/
                            EventHandler.disableExisting();
                            this.updateDaysCount().then((response) => { });
                            window.open('/public/views/night_results.ejs', '_blank', 'location=yes,height=900,width=1000,scrollbars=yes,status=yes');
                            break;
                        } else {
                            correct = false;
                        }
                    }
                    if (!correct) {
                        alert(`Incorrect password. Please try again.`);
                    }/* else {
                        document.getElementById('formSubmit').removeEventListener('click', submit);
                    }*/
                }
            });
        }
    }

    static disableExisting() {
        let form = document.getElementById(`rosterForm`);
        let elements = form.getElementsByClassName(`submitInclude`); // To exclude the submit button
        for (let i = 0; i < elements.length; i++) {
            if (/^((?!\.6\.).)*$/g.test(elements[i].id) && /^((?!team).)*$/g.test(elements[i].id)) {
                if (elements[i] !== `<input type='submit' id='formSubmit' value='PRINT ROSTER' class="button large expanded border">`) {
                    elements[i].disabled = true;
                }
            }
        }
    }

    validate() {
        document.addEventListener('change', () => {
            let form = document.getElementById('rosterForm');
            let valid = true;
            for (let i = 0; i < form.elements.length; i++) {
                if (form.elements[i].hasAttribute("required") && !form.elements[i].value) {
                    valid = false;
                }
            }
            if (valid) {
                document.getElementById('formSubmit').disabled = false;
            }
        });
    }

    async updateDaysCount() {
        await fetch(document.url, {
            method: 'POST',
            // mode:  'no-cors',
            headers: {
                'x-requested-with': 'fetch.1'
            },
            body: JSON.stringify(this.signedIn)
        }).then((response) => {
            if (response.type === `opaque`) {
                console.log(`OPAQUE`);
            }
            if (response.status !== 200) {
                console.log(`ERROR`);
            }
            console.log(response.text);
        }).catch((err) => {
            console.log('Fetch Error :-S', err);
        });
    }
}