"use strict";

export default class NarniaContents {

    static populateWorkDiv(patrollers) {
        let counter = 0;
        let daysCount = 0;
        let halfDaysCount = 0;
        let nightsCount = 0;
        let countsDiv = `<br><br><div class="grid-x grid-padding-x">
                <div class="small-3 cell">&nbsp;</div>
                <div class="small-2 cell"><br><strong>Count Totals:</strong></div>
                    <div class="small-2 cell">
                        <label>Days:
                            <input type="text" id="daysCount">
                        </div>
                    </label>
                <div class="small-2 cell">
                    <label>1/2 Days:
                        <input type="text" id="halfDaysCount">
                    </label>
                </div>
                <div class="small-2 cell">
                    <label>Nights:
                        <input type="text" id="nightsCount">
                    </label>
                </div>
<!--                <div class="small-1 cell">&nbsp;</div>-->
            </div>`;

        document.getElementById(`narniaCounts`).insertAdjacentHTML('beforeend', countsDiv);

        while (counter < patrollers.length) {
            let divContents = {
                patrollerID: `<div class="small-1 cell">
                        <label><strong>ID:</strong>
                            <input type="number" maxlength="6" name="narniaPatrollerID" id="narniaPatrollerID.${counter}" placeholder="ID #">
                        </label>
                    </div>`,
                lastName: `<div class="small-2 cell">
                        <label><strong>Last Name:</strong>
                            <input type="text" id="narniaLastName.${counter}">
                        </label>
                    </div>`,
                firstName: `<div class="small-2 cell">
                        <label><strong>First Name:</strong>
                            <input type="text" id="narniaFirstName.${counter}">
                        </label>
                    </div>`,
                rating: `<div class="small-1 cell">
                        <label><strong>Rating:</strong>
                            <input type="text" id="narniaRating.${counter}">
                        </label>
                    </div>`,
                leader: `<div class="small-1 cell">
                        <label><strong>Leader:</strong>
                            <input type="text" id="narniaLeader.${counter}">
                        </label>
                    </div>`,
                days: `<div class="small-1 cell">
                        <label><strong>Days:</strong>
                            <input type="text" id="narniaDays.${counter}" maxlength="2">
                        </label>
                    </div>`,
                halfDays: `<div class="small-1 cell">
                        <label><strong>Half Days:</strong>
                            <input type="text" id="narniaHalfDays.${counter}" maxlength="2">
                        </label>
                    </div>`,
                nights: `<div class="small-1 cell">
                        <label><strong>Nights:</strong>
                            <input type="text" id="narniaNights.${counter}" maxlength="2">
                        </label>
                    </div>`,
                signOffs: `<div class="small-2 cell narniaSignOffDiv" id="narniaSignOffDiv.${counter}">
                        <label><strong>Signoffs:</strong></label>
                            <i class="far fa-snowflake" id="narniaSnowmobile.${counter}" title="Snowmobile"></i> <i class="fas fa-ambulance" id="narniaToboggan.${counter}" title="Toboggan"></i> <i class="fas fa-medkit" id="narniaSplint.${counter}" title="Sager Splint"></i> <i class="fas fa-heartbeat" id="narniaCpr.${counter}" title="CPR"></i> <i class="fas fa-chair" id="narniaChair.${counter}" title="Chair Evac"></i>
                        <input type="hidden" id="narniaSnowmobileValue.${counter}">
                        <input type="hidden" id="narniaTobogganValue.${counter}">
                        <input type="hidden" id="narniaSplintValue.${counter}">
                        <input type="hidden" id="narniaCprValue.${counter}">
                        <input type="hidden" id="narniaChairValue.${counter}">
                    </div>`
            };

            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.patrollerID);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.lastName);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.firstName);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.rating);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.leader);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.days);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.halfDays);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.nights);
            document.getElementById(`narniaWork`).insertAdjacentHTML('beforeend', divContents.signOffs);

            document.getElementById(`narniaPatrollerID.${counter}`).value = patrollers[counter].ID;
            document.getElementById(`narniaLastName.${counter}`).value = patrollers[counter].LAST_NAME;
            document.getElementById(`narniaFirstName.${counter}`).value = patrollers[counter].FIRST_NAME;
            document.getElementById(`narniaRating.${counter}`).value = patrollers[counter].RATING;
            document.getElementById(`narniaLeader.${counter}`).value = patrollers[counter].LEADER;
            document.getElementById(`narniaDays.${counter}`).value = patrollers[counter].DAYS;
            if (patrollers[counter].DAYS > 0) {
                daysCount++;
            }
            document.getElementById(`narniaHalfDays.${counter}`).value = patrollers[counter].HALF_DAYS;
            if (patrollers[counter].HALF_DAYS > 0) {
                halfDaysCount++;
            }
            document.getElementById(`narniaNights.${counter}`).value = patrollers[counter].NIGHTS;
            if (patrollers[counter].NIGHTS > 0) {
                nightsCount++;
            }
            document.getElementById(`narniaSnowmobileValue.${counter}`).value = patrollers[counter].SNOWMOBILE;
            document.getElementById(`narniaTobogganValue.${counter}`).value = patrollers[counter].TOBOGGAN;
            document.getElementById(`narniaSplintValue.${counter}`).value = patrollers[counter].SPLINT;
            document.getElementById(`narniaCprValue.${counter}`).value = patrollers[counter].CPR;
            document.getElementById(`narniaChairValue.${counter}`).value = patrollers[counter].CHAIR;
            counter++;
        }
        document.getElementById(`daysCount`).value = daysCount.toString();
        document.getElementById(`halfDaysCount`).value = halfDaysCount.toString();
        document.getElementById(`nightsCount`).value = nightsCount.toString();
        return counter;
    }
}