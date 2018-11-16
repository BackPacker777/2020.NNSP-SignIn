"use strict";

export default class DivContents2 {

    static getDivs(teamNum, counter, leaderNum, RACE_TIMES) {
        const TEAMS = {
            CANDIDATES: 5,
            LEADERS: 6
        };

        let patrollerID = `<div class="small-1 cell" id="patroller.${teamNum}.${counter}">
                        <label>ID:
                            <input type="number" class="submitInclude secure" maxlength="6" name="patrollerID" id="patrollerID.${teamNum}.${counter}" placeholder="ID #" required>
                        </label>
                    </div>`;

        let name = `<div class="small-2 cell">
                        <label>Name:
                            <input type="text" class="submitInclude" readonly id="name.${teamNum}.${counter}">
                        </label>
                    </div>`;

        let radio = `<div class="small-1 cell" id="radioDiv.${teamNum}.${counter}">
                        <label>Radio:
                            <input type="number" class="submitInclude" maxlength="2" id="radioNum.${teamNum}.${counter}" placeholder="#">
                        </label>
                    </div>`;

        let rating = `<div class="small-1 cell">
                        <label>Rating:
                            <input type="text" class="submitInclude" readonly id="rating.${teamNum}.${counter}">
                        </label>
                    </div>`;

        let time = `<div class="small-1 cell">
                        <label>Time:
                            <input type="text" class="submitInclude" readonly id="time.${teamNum}.${counter}">
                        </label>
                    </div>`;

        let halfDay = `<div class="small-1 cell">
                        <label>1/2 day?:</label>
                        <div class="grid-x align-center vertical-center">
                            <div class="small-4 cell">
                                <input type="checkbox" class="submitInclude" id="halfDay.${teamNum}.${counter}">
                            </div>
                        </div>
                    </div>`;

        let days = `<div class="small-1 cell">
                        <label>Days:
                            <input type="text" class="submitInclude" readonly id="days.${teamNum}.${counter}">
                        </label>
                    </div>`;

        let guest = `<div class="small-2 cell" id="guestDiv.${teamNum}.${counter}">
                        <label>Guest:
                            <input type="text" class="submitInclude" id="guest.${teamNum}.${counter}" placeholder="Guest">
                        </label>
                    </div>`;

        let blank = `<div class="small-1 cell"></div>`;

        if (!RACE_TIMES) {
            if (teamNum < TEAMS.CANDIDATES) {
                return `<div class="grid-x">
                        ${patrollerID}
                        ${blank}
                        ${name}
                        ${radio}
                        ${rating}
                        ${time}
                        ${halfDay}
                        ${days}
                        ${guest}
                        ${blank}
                    </div>`;
            } else if (teamNum === TEAMS.CANDIDATES) {
                return `<div class="grid-x">
                        ${patrollerID}
                        ${blank}
                        ${name}
                        ${radio}
                        ${rating}
                        ${time}
                        ${halfDay}
                        ${days}
                        ${blank}
                        ${blank}
                        ${blank}
                    </div>`;
            } else {
                let leaders = `<div class="small-1 cell">
                        <label>Leadership:
                            <input type="text" class="submitInclude" readonly id="position.6.${counter}" value="${leaderNum}">
                        </label>
                    </div>`;
                return `<div class="grid-x">
                        ${patrollerID}
                        ${leaders}
                        ${name}
                        ${radio}
                        ${rating}
                        ${time}
                        ${halfDay}
                        ${days}
                        ${guest}
                        ${blank}
                    </div>`;
            }
        } else {
            let racetimes = `<div class="small-1 cell">
                            <label>Race Course:
                                <input type="text" class="submitInclude" id="race.${teamNum}.${counter}" readonly value="${RACE_TIMES[counter]}">
                            </label>
                        </div>`;
        }
    }

    static getNightRaceDivs(teamNum, counter, RACE_TIMES) {
        return `<div class="grid-x">
                    <div class="small-2 cell" id="patroller.${teamNum}.${counter}">
                        <label>ID:
                            <input type="number" class="submitInclude secure" maxlength="6" name="patrollerID" id="patrollerID.${teamNum}.${counter}" placeholder="ID #">
                        </label>
                    </div>
                    <div class="small-3 cell">
                        <label>Name:
                            <input type="text" class="submitInclude" readonly id="name.${teamNum}.${counter}">
                        </label>
                    </div>
                    <div class="small-1 cell" id="radioDiv.${teamNum}.${counter}">
                        <label>Radio:
                            <input type="number" class="submitInclude" maxlength="2" id="radioNum.${teamNum}.${counter}" placeholder="#">
                        </label>
                    </div>
                    <div class="small-1 cell">
                        <label>Rating:
                            <input type="text" class="submitInclude" readonly id="rating.${teamNum}.${counter}">
                        </label>
                    </div>
                    <div class="small-1 cell">
                        <label>Time:
                            <input type="text" class="submitInclude" readonly id="time.${teamNum}.${counter}">
                        </label>
                    </div>
                    <div class="small-1 cell">
                        <label>Days:
                            <input type="text" class="submitInclude" readonly id="days.${teamNum}.${counter}">
                        </label>
                    </div>
                    <div class="small-2 cell" id="guestDiv.${teamNum}.${counter}">
                        <label>Guest:
                            <input type="text" class="submitInclude" id="guest.${teamNum}.${counter}" placeholder="Guest">
                        </label>
                    </div>
                    <div class="small-1 cell">
                        <label>Race Course:
                            <input type="text" class="submitInclude" id="race.${teamNum}.${counter}" readonly value="${RACE_TIMES[counter]}">
                        </label>
                    </div>
                </div>`;
    }
}