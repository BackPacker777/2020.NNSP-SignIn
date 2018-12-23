"use strict";

import NarniaContents from "./NarniaContents.js";

export default class EventHandler {
    constructor(patrollers) {
        this.patrollers = patrollers;
        this.handleNarniaButton();
        this.handleReturnButton();
        this.handlePatrollerWorkButton();
        this.handleUploadFileButton();
    }

    handleNarniaButton() {
        let correctPassword = false;
        document.getElementById(`nspLogo`).addEventListener(`click`, () => {
            document.getElementById("narniaDate").innerText = document.getElementById("date").innerText;
            document.getElementById("narniaWeekDay").innerText = document.getElementById("weekDay").innerText;
            document.getElementById("narniaDayNight").innerText = document.getElementById("dayNight").innerText;
            let password = prompt(`Password: `);
            for (let person of this.patrollers) {
                if (person.ID === password && person.LEADER) {
                    correctPassword = true;
                }
            }
            if (correctPassword) {
                new NarniaContents();
                document.getElementById('narniaDiv').style.display = 'block';
                document.getElementById('masterDiv').style.display = 'none';
                document.getElementById('topMast').style.display = 'none';
            } else {
                alert(`Incorrect Password`);
            }
        });
    }

    handleReturnButton() {
        document.getElementById(`formReturn`).addEventListener(`click`, () => {
            document.getElementById('narniaDiv').style.display = 'none';
            document.getElementById('masterDiv').style.display = 'block';
            document.getElementById('topMast').style.display = 'block';
        });
    }

    handlePatrollerWorkButton() {
        document.getElementById(`patrollerWork`).addEventListener(`click`, () => {
            let counter = NarniaContents.populateWorkDiv(this.patrollers);
            this.handleNarniaSnowmobile(counter);
            this.handleNarniaToboggan();
            this.handleNarniaSplint();
            this.handleNarniaCpr();
            this.handleNarniaChair();
            let updateButton = `<input type="submit" class="button success expanded border" id="patrollerUpdateButton" value="Update Patroller Data">`;
            document.getElementById('narniaCenterButton').insertAdjacentHTML('beforeend', updateButton);
            document.getElementById(`patrollerUpdateButton`).addEventListener(`click`, (event) => {
                event.stopImmediatePropagation();
                this.updatePatrollerData(counter);
                document.getElementById('narniaWork').innerHTML = '';
                document.getElementById('narniaCenterButton').innerHTML = '';
                alert(`Patroller Data Updated.`);
            });
        });
    }

    handleNarniaSnowmobile(maximum) {
        let counter = 0;
        while (counter < maximum) {
            if (Number(this.patrollers[counter].SNOWMOBILE) !== 1) {
                document.getElementById(`narniaSnowmobile.${counter}`).style.color = 'rgb(204,75,55)';
                document.getElementById(`narniaSnowmobile.${counter}`).addEventListener(`click`, () => {
                    this.patrollers[counter].SNOWMOBILE = 1;
                    document.getElementById(`narniaSnowmobile.${counter}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`narniaSnowmobile.${counter}`).style.cursor = 'default';
                });
            } else {
                document.getElementById(`narniaSnowmobile.${counter}`).style.color = 'rgb(23,121,186)';
                document.getElementById(`narniaSnowmobile.${counter}`).style.cursor = 'default';
            }
            counter++;
        }
    }

    handleNarniaToboggan() {

    }

    handleNarniaSplint() {

    }

    handleNarniaCpr() {

    }

    handleNarniaChair() {

    }

    handleUploadFileButton() {
        document.getElementById(`uploadFile`).addEventListener(`click`, () => {

        });
    }

    updatePatrollerData(counter) {
        let updatedPatrollers = [];
        for (let i = 0; i < counter; i++) {
            updatedPatrollers[i] = [];
            updatedPatrollers[i][0] = document.getElementById(`narniaPatrollerID.${i}`).value;
            updatedPatrollers[i][1] = document.getElementById(`narniaLastName.${i}`).value;
            updatedPatrollers[i][2] = document.getElementById(`narniaFirstName.${i}`).value;
            updatedPatrollers[i][3] = document.getElementById(`narniaRating.${i}`).value;
            updatedPatrollers[i][4] = document.getElementById(`narniaLeader.${i}`).value;
            updatedPatrollers[i][5] = document.getElementById(`narniaDays.${i}`).value;
            updatedPatrollers[i][6] = document.getElementById(`narniaHalfDays.${i}`).value;
            updatedPatrollers[i][7] = document.getElementById(`narniaNights.${i}`).value;
            updatedPatrollers[i][8] = document.getElementById(`narniaSnowmobile.${i}`).value;
            updatedPatrollers[i][9] = document.getElementById(`narniaToboggan.${i}`).value;
            updatedPatrollers[i][10] = document.getElementById(`narniaSplint.${i}`).value;
            updatedPatrollers[i][11] = document.getElementById(`narniaCpr.${i}`).value;
            updatedPatrollers[i][12] = document.getElementById(`narniaChair.${i}`).value;
        }
        fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(updatedPatrollers),
            headers: {
                'x-requested-with': 'fetch.3',
                'mode': 'no-cors'
            }
        }).then((response) => {
            return response.json();
        }).catch((error) => {
            console.log(error);
        });
    }
}