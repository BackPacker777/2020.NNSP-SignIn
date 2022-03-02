import DivContents from "./DivContents2.js";
import WebStorage from "./WebStorage.js";

export default class narniaAdjustShiftCounts {
    #patrollers;
    #signedIn;
    #buttons;
    #callback;

    constructor(patrollers, signedIn, buttons, callback) {
        this.#patrollers = patrollers;
        this.#signedIn = signedIn;
        this.#buttons = buttons;
        this.#callback = callback;
        this.main();
    }

    main() {
        document.getElementById('modalDiv').style.display = 'block';
        document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Updating Patroller Shifts</h3>`);
        document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getDivs(8, 1));
        document.getElementById('modalSubmitButton').disabled = true;
        document.getElementById(`fixButton`).classList.add('disabled');
        document.getElementById(`nspLogo`).classList.add('disabled');
        document.getElementById(`modalPatrollerID.8.1`).focus();
        document.getElementById('modalCancelButton').addEventListener('click', () => {
            document.getElementById(`fixButton`).classList.remove('disabled');
            document.getElementById(`nspLogo`).classList.remove('disabled');
            document.getElementById(`modalPatrollerID.8.1`).value = "";
            document.getElementById(`modalName.8.1`).value = "";
            document.getElementById(`modalDays.8.1`).value = "";
            document.getElementById(`modalNights.8.1`).value = "";
            document.getElementById(`modalHalfs.8.1`).value = "";
            document.getElementById("modalTitle").innerHTML = "";
            document.getElementById("dataEntryDiv").innerHTML = "";
            document.getElementById('modalDiv').style.display = 'none';
        });
        document.getElementById(`modalPatrollerID.8.1`).addEventListener('change', () => {
            let valid = false;
            if (document.getElementById(`modalPatrollerID.8.1`).value !== '') {
                for (let i = 0; i < this.#patrollers.length; i++) {
                    if (i < this.#patrollers.length && Number(document.getElementById(`modalPatrollerID.8.1`).value) === Number(this.#patrollers[i].ID)) {
                        valid = true;
                        document.getElementById(`modalName.8.1`).value = `${this.#patrollers[i].FIRST_NAME} ${this.#patrollers[i].LAST_NAME}`;
                        document.getElementById(`modalDays.8.1`).value = this.#patrollers[i].DAYS;
                        document.getElementById(`modalDays.8.1`).addEventListener('change', () => {
                            if (!document.getElementById(`modalDays.8.1`).reportValidity()) {
                                document.getElementById('modalSubmitButton').disabled = true;
                                document.getElementById(`modalDays.8.1`).value = "";
                            } else {
                                document.getElementById(`modalShifts.8.1`).value = calculateShifts();
                                document.getElementById('modalSubmitButton').disabled = false;
                            }
                        });
                        document.getElementById(`modalNights.8.1`).value = this.#patrollers[i].NIGHTS;
                        document.getElementById(`modalNights.8.1`).addEventListener('change', () => {
                            if (!document.getElementById(`modalNights.8.1`).reportValidity()) {
                                document.getElementById('modalSubmitButton').disabled = true;
                                document.getElementById(`modalNights.8.1`).value = "";
                            } else {
                                document.getElementById(`modalShifts.8.1`).value = calculateShifts();
                                document.getElementById('modalSubmitButton').disabled = false;
                            }
                        });
                        document.getElementById(`modalHalfs.8.1`).value = this.#patrollers[i].HALF_DAYS;
                        document.getElementById(`modalHalfs.8.1`).addEventListener('change', () => {
                            if (!document.getElementById(`modalHalfs.8.1`).reportValidity()) {
                                document.getElementById('modalSubmitButton').disabled = true;
                                document.getElementById(`modalHalfs.8.1`).value = "";
                            } else {
                                document.getElementById(`modalShifts.8.1`).value = calculateShifts();
                                document.getElementById('modalSubmitButton').disabled = false;
                            }
                        });
                        document.getElementById(`modalShifts.8.1`).value = calculateShifts();
                        break;
                    }
                }
                if (!valid) {
                    alert(`Invalid patroller number.`);
                    document.getElementById(`modalPatrollerID.8.1`).value = '';
                }
            }
        });
        document.getElementById('modalSubmitButton').addEventListener('click', () => {
            for (let i = 0; i < this.#patrollers.length; i++) {
                if (Number(document.getElementById(`modalPatrollerID.8.1`).value) === Number(this.#patrollers[i].ID)) {
                    this.#patrollers[i].DAYS = document.getElementById(`modalDays.8.1`).value;
                    this.#patrollers[i].NIGHTS = document.getElementById(`modalNights.8.1`).value;
                    this.#patrollers[i].HALF_DAYS = document.getElementById(`modalHalfs.8.1`).value;
                    break;
                }
            }
            for (let i = 0; i < this.#signedIn.length; i++) {
                if (this.#signedIn.length > 0) {
                    if (Number(document.getElementById(`modalPatrollerID.8.1`).value) === Number(this.#signedIn[i].ID)) {
                        this.#signedIn[i].DAYS = Number(document.getElementById(`modalDays.8.1`).value);
                        this.#signedIn[i].NIGHTS = Number(document.getElementById(`modalNights.8.1`).value);
                        this.#signedIn[i].HALF_DAYS = Number(document.getElementById(`modalHalfs.8.1`).value);
                        let halfs = Number(this.#signedIn[i].HALF_DAYS / 2);
                        this.#signedIn[i].TOTAL_DAYS = Number(this.#signedIn[i].DAYS) + Number(this.#signedIn[i].NIGHTS) + halfs;
                        WebStorage.populateLocalStorage(this.#signedIn[i], this.#signedIn[i].POSITION_TEAM);
                        this.#callback(this.#signedIn);
                        break;
                    }
                }
            }
            document.getElementById('formSubmit').disabled = false;
            document.getElementById(`fixButton`).classList.remove('disabled');
            document.getElementById(`nspLogo`).classList.remove('disabled');
            for (let button of this.#buttons) {
                document.getElementById(button.id).disabled = false;
            }
            document.getElementById(`modalPatrollerID.8.1`).value = "";
            document.getElementById(`modalName.8.1`).value = "";
            document.getElementById(`modalDays.8.1`).value = "";
            document.getElementById(`modalNights.8.1`).value = "";
            document.getElementById(`modalHalfs.8.1`).value = "";
            document.getElementById("modalTitle").innerHTML = "";
            document.getElementById("dataEntryDiv").innerHTML = "";
            document.getElementById('modalDiv').style.display = 'none';
        });

        let calculateShifts = function() {
            return Number(document.getElementById(`modalDays.8.1`).value) + Number(document.getElementById(`modalNights.8.1`).value) + Number(document.getElementById(`modalHalfs.8.1`).value / 2);
        }
    }
}




