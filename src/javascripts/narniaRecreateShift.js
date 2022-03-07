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

            let shiftStuff = [];
            this.populateRoster(shiftDate, shiftDayNight).then((results) => {
                shiftStuff = JSON.parse(results);
                console.log(`results = ${JSON.stringify(shiftStuff)}`);
                this.displayResults(shiftStuff);//.then((response) => {
                //     console.log(JSON.stringify(response));
                // });
            });

            window.open('/src/views/results.ejs' + '?x=' + new Date().getTime(), '_blank', 'location=yes,height=900,width=1000,scrollbars=yes,status=yes');
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
        return results.text();
    }

    async displayResults(shiftStuff) {
        console.log(`displayResults = ${JSON.stringify(shiftStuff)}`);
        await fetch(document.url, {
            method: 'POST',
            body: JSON.stringify(shiftStuff),
            headers: {
                'x-requested-with': `fetch.2`,
                'mode': 'no-cors'
            }
        });
    }
}