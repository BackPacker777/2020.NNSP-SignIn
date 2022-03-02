import DivContents from "./DivContents2.js";

export default class narniaAdjustShiftCounts {
    #date;
    #removeMe;
    #shiftRoster;

    constructor() {
        this.#date = '';
        this.#removeMe = '';
        this.shiftRoster = [];
        this.main();
    }

    main() {
        let shiftDate = null;
        let shiftDayNight = null;
        document.getElementById('modalDiv').style.display = 'block';
        document.getElementById("modalTitle").insertAdjacentHTML('beforeend', `<h3>Enter Shift Date to Recreate</h3>`);
        document.getElementById("dataEntryDiv").insertAdjacentHTML('beforeend', DivContents.getNarniaShiftRecreateDiv());
        document.getElementById('modalSubmitButton').disabled = true;
        document.getElementById(`fixButton`).classList.add('disabled');
        document.getElementById(`nspLogo`).classList.add('disabled');
        document.getElementById(`narniaShiftDate`).focus();
        document.getElementById('modalCancelButton').addEventListener('click', () => {
            document.getElementById(`fixButton`).classList.remove('disabled');
            document.getElementById(`nspLogo`).classList.remove('disabled');
            document.getElementById("modalTitle").innerHTML = "";
            document.getElementById("dataEntryDiv").innerHTML = "";
            document.getElementById('modalDiv').style.display = 'none';
        });
        document.getElementById('narniaShiftDate').addEventListener('change', () => {
            shiftDate = document.getElementById('narniaShiftDate').value;
            if (shiftDayNight !== null) {
                document.getElementById('modalSubmitButton').disabled = false;
            }
        });
        document.querySelectorAll('input[name="narniaShift"]').forEach((element) => {
            element.addEventListener("change", this.#removeMe = (event) => {
                shiftDayNight = event.target.value;
                if (shiftDate !== null) {
                    document.getElementById('modalSubmitButton').disabled = false;
                }
            });
        });
        document.getElementById('modalSubmitButton').addEventListener('click', () => {
            return this.populateRoster();
        });
    }

    populateRoster() {

    }
}