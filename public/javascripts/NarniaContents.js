"use strict";

export default class NarniaContents {

    static populateWorkDiv(patrollers) {
        let counter = 0;
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
            document.getElementById(`narniaHalfDays.${counter}`).value = patrollers[counter].HALF_DAYS;
            document.getElementById(`narniaNights.${counter}`).value = patrollers[counter].NIGHTS;
            document.getElementById(`narniaSnowmobileValue.${counter}`).value = patrollers[counter].SNOWMOBILE;
            document.getElementById(`narniaTobogganValue.${counter}`).value = patrollers[counter].TOBOGGAN;
            document.getElementById(`narniaSplintValue.${counter}`).value = patrollers[counter].SPLINT;
            document.getElementById(`narniaCprValue.${counter}`).value = patrollers[counter].CPR;
            document.getElementById(`narniaChairValue.${counter}`).value = patrollers[counter].CHAIR;
            counter++;
        }
        return counter;
    }
}