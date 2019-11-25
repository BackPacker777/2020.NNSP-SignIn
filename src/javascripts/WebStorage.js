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
        localStorage.setItem(`${counter}.guest`, pageData.GUEST);
        localStorage.setItem(`${counter}.positionTeam`, pageData.POSITION_TEAM);
    }

    /**
     * Get all localStorage items
     * @return boolean
     */
    static checkLocalStorage() {
        return localStorage.length > 0;
    }

    /**
     * Get all localStorage items
     * @return null
     */
    static populateForm(isWeekend, dayNight) {
        let teams = [];
        // let key, value;
        for (let i = 0; i < localStorage.length; i++ ) {
            let key = localStorage.key(i);
            // let value = localStorage[key];
            if (key.substring(4,9) === 'team') {
                teams.push(Number(localStorage[key]));
            }
            // console.log(`${key}: ${value}`);
        }
        if (teams[0] > 0) {
            if (! isWeekend && dayNight === 'Day') {
                document.getElementById(`weekendOverride`).checked = true;
                let event = new Event('click');
                let event2 = new Event('change');
                document.getElementById('weekendOverride').dispatchEvent(event);
                for (let i = 0; i < teams.length; i++) {
                    // console.log(`Dispatching joinTeam.${team}`);
                    document.getElementById(`joinTeam.${teams[i]}`).dispatchEvent(event);
                    for (let j = 0; i < localStorage.length; j++ ) {
                        let key = localStorage.key(i);
                        // let value = localStorage[key];
                        console.log(`${key.substring(4,6)} - ${key.substring(2,3)} - ${i + 1}`);
                        // if (key.substring(4,6) === 'id' && key.substring(2,3) === i + 1) {
                        if (key.substring(4,6) === 'id') {
                            let id = `patrollerID.${teams[i]}.${i + 1}`;
                            document.getElementById(id).value = localStorage[key];
                            document.getElementById(id).dispatchEvent(event2);
                        }
                    }
                }
            }
        }
    }

    /**
     * Clear localStorage
     */
    static purgeLocalStorage() {
        localStorage.clear();
    }
}