import DivContents from "./DivContents2.js";

export default class narniaAdjustShiftCounts {
    #date;
    #removeMe;
    #shiftData;

    constructor() {
        this.#date = '';
        this.#removeMe = '';
        this.#shiftData = [];
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
            document.getElementById('formSubmit').disabled = false;
            document.getElementById(`fixButton`).classList.remove('disabled');
            document.getElementById(`nspLogo`).classList.remove('disabled');
            document.getElementById("modalTitle").innerHTML = "";
            document.getElementById("dataEntryDiv").innerHTML = "";
            document.getElementById('modalDiv').style.display = 'none';

            this.populateRoster(shiftDate, shiftDayNight).then((results) => {
                console.log(`results = ${results}`);
                // results = JSON.parse(results);
                /*this.displayResults(results).then((response) => {
                    console.log(response);
                });*/
            });

            /*this.populateRoster(shiftDate, shiftDayNight)
                results = JSON.parse(results);
                console.log(`results = ${results}`);
                this.displayResults(results).then((response) => {
                    console.log(`response = ${JSON.stringify(response)}`);
                    window.open('/src/views/results.ejs' + '?x=' + new Date().getTime(), '_blank', 'location=yes,height=900,width=1000,scrollbars=yes,status=yes');
                });
            });*/
        });
    }

    async populateRoster(shiftDate, shiftDayNight) {
        let shiftData = [shiftDate, shiftDayNight];
        const results = await fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(shiftData),
            headers: {
                'x-requested-with': `fetch.6`,
                'mode': 'no-cors'
            }
        });
        // return results.text();
        this.displayResults(results).then((response) => {

        });
    }

    async displayResults(shiftData) {
        const response = await fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(shiftData),
            headers: {
                'x-requested-with': `fetch.2`,
                'mode': 'no-cors'
            }
        });
        console.log(`response = ${response}`);
        return response.text();
    }
}