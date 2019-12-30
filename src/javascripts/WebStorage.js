/**
 *  WebStorage class
 *  @desc Used to persist form data until explicitly cleared. Prevents data loss due to accidental form closure
 *  @export
 */
export default class WebStorage {
    /**
     * @param pageData
     */
    static populateLocalStorage(pageData) {
        let counter = `${pageData.TEAM}.${pageData.POSITION_TEAM}`;
        if (pageData.GUEST) {
            localStorage.setItem(`${counter}.guest`, pageData.GUEST);
        }
        localStorage.setItem(`${counter}.id`, pageData.ID);
        localStorage.setItem(`${counter}.radio`, pageData.RADIO);
        localStorage.setItem(`${counter}.name`, pageData.NAME);
        localStorage.setItem(`${counter}.rating`, pageData.RATING);
        localStorage.setItem(`${counter}.time`, pageData.TIME);
        localStorage.setItem(`${counter}.days`, pageData.DAYS);
        localStorage.setItem(`${counter}.team`, pageData.TEAM);
        localStorage.setItem(`${counter}.nights`, pageData.NIGHTS);
        localStorage.setItem(`${counter}.halfDays`, pageData.HALF_DAYS);
        localStorage.setItem(`${counter}.totalDays`, pageData.TOTAL_DAYS);
        localStorage.setItem(`${counter}.snowmobile`, pageData.SNOWMOBILE);
        localStorage.setItem(`${counter}.toboggan`, pageData.TOBOGGAN);
        localStorage.setItem(`${counter}.splint`, pageData.SPLINT);
        localStorage.setItem(`${counter}.cpr`, pageData.CPR);
        localStorage.setItem(`${counter}.chair`, pageData.CHAIR);
        localStorage.setItem(`${counter}.todayHalf`, pageData.TODAY_HALF);
        localStorage.setItem(`${counter}.positionTeam`, pageData.POSITION_TEAM);
    }

    /**
     * Get all localStorage items
     * @return boolean
     */
    static checkLocalStorage() {
        console.log(localStorage.length);
        return localStorage.length > 0;
    }

    /**
     * Get all localStorage items
     * @return null
     */
    static populateForm(isWeekend, dayNight) {
        let runPopulate = (teams) => {
            let event = new Event('click');
            let event2 = new Event('change');
            for (let i = 0; i < teams.length; i++) {
                let counter = 1;
                let MAX_COUNTER = 8;
                while (counter <= MAX_COUNTER) {
                    let teamPosition = `${teams[i]}.${counter}`;
                    console.log(`Team Position: ${teamPosition}`);
                    if (localStorage.getItem(`${teamPosition}.id`)) {
                        document.getElementById(`joinTeam.${teams[i]}`).dispatchEvent(event);
                        document.getElementById(`patrollerID.${teamPosition}`).value = localStorage.getItem(`${teamPosition}.id`);
                        document.getElementById(`patrollerID.${teamPosition}`).readOnly = true;
                        document.getElementById(`time.${teamPosition}`).value = localStorage.getItem(`${teamPosition}.time`);
                        document.getElementById(`patrollerID.${teamPosition}`).dispatchEvent(event2);
                        document.getElementById(`name.${teamPosition}`).value = localStorage.getItem(`${teamPosition}.name`);
                        if (localStorage.getItem(`${teamPosition}.radio`)) {
                            document.getElementById(`radioNum.${teamPosition}`).value = localStorage.getItem(`${teamPosition}.radio`);
                            document.getElementById(`radioNum.${teamPosition}`).dispatchEvent(event2);
                            document.dispatchEvent(event2);
                        }
                        document.getElementById(`rating.${teamPosition}`).value = localStorage.getItem(`${teamPosition}.rating`);
                        if (localStorage.getItem(`${teamPosition}.guest`)) {
                            document.getElementById(`guest.${teamPosition}`).value = localStorage.getItem(`${teamPosition}.guest`);
                            document.getElementById(`guest.${teamPosition}`).dispatchEvent(event2);
                        }
                    }
                    counter++;
                }
            }
        };

        let teams = [];
        for (let i = 0; i < localStorage.length; i++ ) {
            let key = localStorage.key(i);
            let value = localStorage[key];
            if (key.substring(4,9) === 'team') {
                teams.push(Number(localStorage[key]));
            }
            // console.log(`${key}: ${value}`);
        }
        console.log(teams.length);
        if (! isWeekend && dayNight === 'Day') {
            let event = new Event('click');
            console.log(`Running !weekend & Day`);
            document.getElementById(`weekendOverride`).checked = true;
            document.getElementById('weekendOverride').dispatchEvent(event);
            runPopulate(teams);
        } else {
            console.log(`Running others`);
            runPopulate(teams);
        }
    }

    /**
     * Clear localStorage
     */
    static purgeLocalStorage() {
        localStorage.clear();
    }
}