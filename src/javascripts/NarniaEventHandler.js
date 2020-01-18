"use strict";

import NarniaContents from "./NarniaContents.js";

export default class EventHandler {

    constructor(patrollers, SIGN_OFFS) {
        this.patrollers = patrollers;
        console.log(this.patrollers);
        this.handleNarniaButton();
        this.handleReturnButton();
        this.handlePatrollerWorkButton(SIGN_OFFS);
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

    handlePatrollerWorkButton(SIGN_OFFS) {
        let alreadyRun = false;
        document.getElementById(`patrollerWork`).addEventListener(`click`, (event) => {
            if (!alreadyRun) {
                event.stopImmediatePropagation();
                let counter = NarniaContents.populateWorkDiv(this.patrollers);
                // this.handleSignOffs(counter, SIGN_OFFS);
                this.handleNarniaSnowmobile(counter);
                this.handleNarniaToboggan(counter);
                this.handleNarniaScavenger(counter);
                this.handleNarniaCpr(counter);
                this.handleNarniaChair(counter);
                let updateButton = `<input type="submit" class="button success expanded border" id="patrollerUpdateButton" value="Update Patroller Data">`;
                document.getElementById('narniaCenterButton').insertAdjacentHTML('beforeend', updateButton);
                document.getElementById(`patrollerUpdateButton`).addEventListener(`click`, (event) => {
                    event.stopImmediatePropagation();
                    this.updatePatrollerData(counter);
                    document.getElementById('narniaWork').innerHTML = '';
                    document.getElementById('narniaCenterButton').innerHTML = '';
                    alert(`Patroller Data Updated.`);
                });
            }
            alreadyRun = true;
        });
    }

    handleSignOffs(maximum, SIGN_OFFS) {
        console.log(SIGN_OFFS);
        for (let signOff of SIGN_OFFS) {
            let counter = 0;
            let SIGN_OFF = signOff.toUpperCase();
            let patrollerSignOff = eval(`this.patrollers[${counter}].${SIGN_OFF}`);
            console.log(`Patroller Sign Off = ${patrollerSignOff}`);
            while (counter < maximum) {
                document.getElementById(`narnia${signOff}.${counter}`).addEventListener(`click`, (event) => {
                    let id = event.target.id.substring(17,19);
                    console.log(id);
                    let currentSignOff = eval(`this.patrollers[${id}].${SIGN_OFF}`);
                    console.log(`Current Sign Off = ${currentSignOff}`);
                    if (Number(currentSignOff) !== 1) {
                        document.getElementById(`narnia${signOff}Value.${id}`).value = 1;
                        document.getElementById(`narnia${signOff}.${id}`).style.color = 'rgb(23,121,186)';
                        document.getElementById(`narnia${signOff}.${id}`).style.cursor = 'default';
                    } else {
                        currentSignOff = 0;
                        document.getElementById(`narnia${signOff}Value.${id}`).value = 0;
                        document.getElementById(`narnia${signOff}.${id}`).style.color = 'rgb(204,75,55)';
                    }
                });
                if (Number(patrollerSignOff) !== 1) {
                    document.getElementById(`narnia${signOff}.${counter}`).style.color = 'rgb(204,75,55)';
                } else {
                    document.getElementById(`narnia${signOff}.${counter}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`narnia${signOff}.${counter}`).style.cursor = 'default';
                }
                counter++;
            }
        }
    }

    handleNarniaSnowmobile(maximum) {
        let counter = 0;
        while (counter < maximum) {
            document.getElementById(`narniaSnowmobile.${counter}`).addEventListener(`click`, (event) => {
                let id = event.target.id.substring(17,19);
                if (Number(this.patrollers[id].SNOWMOBILE) !== 1) {
                    this.patrollers[id].SNOWMOBILE = 1;
                    document.getElementById(`narniaSnowmobileValue.${id}`).value = 1;
                    document.getElementById(`narniaSnowmobile.${id}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`narniaSnowmobile.${id}`).style.cursor = 'default';
                } else {
                    this.patrollers[id].SNOWMOBILE = 0;
                    document.getElementById(`narniaSnowmobileValue.${id}`).value = 0;
                    document.getElementById(`narniaSnowmobile.${id}`).style.color = 'rgb(204,75,55)';
                }
            });
            if (Number(this.patrollers[counter].SNOWMOBILE) !== 1) {
                document.getElementById(`narniaSnowmobile.${counter}`).style.color = 'rgb(204,75,55)';
            } else {
                document.getElementById(`narniaSnowmobile.${counter}`).style.color = 'rgb(23,121,186)';
                document.getElementById(`narniaSnowmobile.${counter}`).style.cursor = 'default';
            }
            counter++;
        }
    }

    handleNarniaToboggan(maximum) {
        let counter = 0;
        while (counter < maximum) {
            document.getElementById(`narniaToboggan.${counter}`).addEventListener(`click`, (event) => {
                let id = event.target.id.substring(15,17);
                if (Number(this.patrollers[id].TOBOGGAN) !== 1) {
                    this.patrollers[id].TOBOGGAN = 1;
                    document.getElementById(`narniaTobogganValue.${id}`).value = 1;
                    document.getElementById(`narniaToboggan.${id}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`narniaToboggan.${id}`).style.cursor = 'default';
                } else {
                    this.patrollers[id].TOBOGGAN = 0;
                    document.getElementById(`narniaTobogganValue.${id}`).value = 0;
                    document.getElementById(`narniaToboggan.${id}`).style.color = 'rgb(204,75,55)';
                }
            });
            if (Number(this.patrollers[counter].TOBOGGAN) !== 1) {
                document.getElementById(`narniaToboggan.${counter}`).style.color = 'rgb(204,75,55)';
            } else {
                document.getElementById(`narniaToboggan.${counter}`).style.color = 'rgb(23,121,186)';
                document.getElementById(`narniaToboggan.${counter}`).style.cursor = 'default';
            }
            counter++;
        }
    }

    handleNarniaScavenger(maximum) {
        let counter = 0;
        while (counter < maximum) {
            document.getElementById(`narniaScavenger.${counter}`).addEventListener(`click`, (event) => {
                let id = event.target.id.substring(16,18);
                if (Number(this.patrollers[id].SCAVENGER) !== 1) {
                    this.patrollers[id].SCAVENGER = 1;
                    document.getElementById(`narniaScavengerValue.${id}`).value = 1;
                    document.getElementById(`narniaScavenger.${id}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`narniaScavenger.${id}`).style.cursor = 'default';
                } else {
                    this.patrollers[id].SCAVENGER = 0;
                    document.getElementById(`narniaScavengerValue.${id}`).value = 0;
                    document.getElementById(`narniaScavenger.${id}`).style.color = 'rgb(204,75,55)';
                }
            });
            if (Number(this.patrollers[counter].SCAVENGER) !== 1) {
                document.getElementById(`narniaScavenger.${counter}`).style.color = 'rgb(204,75,55)';
            } else {
                document.getElementById(`narniaScavenger.${counter}`).style.color = 'rgb(23,121,186)';
                document.getElementById(`narniaScavenger.${counter}`).style.cursor = 'default';
            }
            counter++;
        }
    }

    handleNarniaCpr(maximum) {
        let counter = 0;
        while (counter < maximum) {
            document.getElementById(`narniaCpr.${counter}`).addEventListener(`click`, (event) => {
                let id = event.target.id.substring(10,12);
                if (Number(this.patrollers[id].CPR) !== 1) {
                    this.patrollers[id].CPR = 1;
                    document.getElementById(`narniaCprValue.${id}`).value = 1;
                    document.getElementById(`narniaCpr.${id}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`narniaCpr.${id}`).style.cursor = 'default';
                } else {
                    this.patrollers[id].CPR = 0;
                    document.getElementById(`narniaCprValue.${id}`).value = 0;
                    document.getElementById(`narniaCpr.${id}`).style.color = 'rgb(204,75,55)';
                }
            });
            if (Number(this.patrollers[counter].CPR) !== 1) {
                document.getElementById(`narniaCpr.${counter}`).style.color = 'rgb(204,75,55)';
            } else {
                document.getElementById(`narniaCpr.${counter}`).style.color = 'rgb(23,121,186)';
                document.getElementById(`narniaCpr.${counter}`).style.cursor = 'default';
            }
            counter++;
        }
    }

    handleNarniaChair(maximum) {
        let counter = 0;
        while (counter < maximum) {
            document.getElementById(`narniaChair.${counter}`).addEventListener(`click`, (event) => {
                let id = event.target.id.substring(12,14);
                if (Number(this.patrollers[id].CHAIR) !== 1) {
                    this.patrollers[id].CHAIR = 1;
                    document.getElementById(`narniaChairValue.${id}`).value = 1;
                    document.getElementById(`narniaChair.${id}`).style.color = 'rgb(23,121,186)';
                    document.getElementById(`narniaChair.${id}`).style.cursor = 'default';
                } else {
                    this.patrollers[id].CHAIR = 0;
                    document.getElementById(`narniaChairValue.${id}`).value = 0;
                    document.getElementById(`narniaChair.${id}`).style.color = 'rgb(204,75,55)';
                }
            });
            if (Number(this.patrollers[counter].CHAIR) !== 1) {
                document.getElementById(`narniaChair.${counter}`).style.color = 'rgb(204,75,55)';
            } else {
                document.getElementById(`narniaChair.${counter}`).style.color = 'rgb(23,121,186)';
                document.getElementById(`narniaChair.${counter}`).style.cursor = 'default';
            }
            counter++;
        }
    }

    handleUploadFileButton() {
        document.getElementById(`uploadFile`).addEventListener(`click`, () => {
            //TODO
        });
    }

    updatePatrollerData(counter) {
        let updatedPatrollers = [];
        for (let i = 0; i < counter; i++) {
            updatedPatrollers[i] = {
                "ID": document.getElementById(`narniaPatrollerID.${i}`).value,
                "LAST_NAME": document.getElementById(`narniaLastName.${i}`).value,
                "FIRST_NAME": document.getElementById(`narniaFirstName.${i}`).value,
                "RATING": document.getElementById(`narniaRating.${i}`).value,
                "LEADER": document.getElementById(`narniaLeader.${i}`).value,
                "DAYS": document.getElementById(`narniaDays.${i}`).value,
                "HALF_DAYS": document.getElementById(`narniaHalfDays.${i}`).value,
                "NIGHTS": document.getElementById(`narniaNights.${i}`).value,
                "SNOWMOBILE": document.getElementById(`narniaSnowmobileValue.${i}`).value,
                "TOBOGGAN": document.getElementById(`narniaTobogganValue.${i}`).value,
                "SCAVENGER": document.getElementById(`narniaScavengerValue.${i}`).value,
                "CPR": document.getElementById(`narniaCprValue.${i}`).value,
                "CHAIR": document.getElementById(`narniaChairValue.${i}`).value
            }
        }

        fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(updatedPatrollers),
            headers: {
                'x-requested-with': 'fetch.1',
                'mode': 'no-cors'
            }
        }).then((response) => {
            return response.json();
        }).catch((error) => {
            console.log(error);
        });
    }
}