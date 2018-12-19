"use strict";

export default class NarniaContents {

    static populateWorkDiv(patrollers) {
        console.log(patrollers);
        let counter = 0;
        while (counter < patrollers.length) {
            let divContents = {
                patrollerID: `<div class="small-1 cell">
                        <label>ID:
                            <input type="number" maxlength="6" name="narniaPatrollerID" id="narniaPatrollerID.${counter}" placeholder="ID #">
                        </label>
                    </div>`,
                lastName: `<div class="small-2 cell">
                        <label>Last Name:
                            <input type="text" id="narniaLastName.${counter}">
                        </label>
                    </div>`,
                firstName: `<div class="small-2 cell">
                        <label>First Name:
                            <input type="text" id="narniaFirstName.${counter}">
                        </label>
                    </div>`,
                rating: `<div class="small-1 cell">
                        <label>Rating:
                            <input type="text" id="narniaRating.${counter}">
                        </label>
                    </div>`,
                leader: `<div class="small-1 cell">
                        <label>Leader:
                            <input type="text" id="narniaLeader.${counter}">
                        </label>
                    </div>`,
                days: `<div class="small-1 cell">
                        <label>Days:
                            <input type="text" id="narniaDays.${counter}" maxlength="2">
                        </label>
                    </div>`,
                halfDays: `<div class="small-1 cell">
                        <label>Half Days:
                            <input type="text" id="narniaHalfDays.${counter}" maxlength="2">
                        </label>
                    </div>`,
                nights: `<div class="small-1 cell">
                        <label>Nights:
                            <input type="text" id="narniaNights.${counter}" maxlength="2">
                        </label>
                    </div>`,
                signOffs: `<div class="small-2 cell signoffDiv" id="signoffDiv.${counter}">
                        <label>Signoffs:</label>
                        <i class="far fa-snowflake" id="snowmobile.${counter}" title="Snowmobile"></i> <i class="fas fa-ambulance" id="toboggan.${counter}" title="Toboggan"></i> <i class="fas fa-medkit" id="splint.${counter}" title="Sager Splint"></i> <i class="fas fa-heartbeat" id="cpr.${counter}" title="CPR"></i> <i class="fas fa-chair" id="chair.${counter}" title="Chair Evac"></i>
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

            counter++;
        }

    }
}