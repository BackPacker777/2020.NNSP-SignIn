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
            let value = localStorage[key];
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
                    document.getElementById(`joinTeam.${teams[i]}`).dispatchEvent(event);
                    for (let j = 0; j < localStorage.length; j++ ) {
                        let key = localStorage.key(j);
                        // console.log(`${key.substring(4,6)} - ${key.substring(2,3)}`);
                        if (key.substring(4,6) === 'id') {
                            let id = `patrollerID.${teams[i]}.${key.substring(2,3)}`;
                            document.getElementById(id).value = localStorage[key];
                            document.getElementById(id).dispatchEvent(event2);
                            for (let k = 0; k < localStorage.length; k++ ) {
                                let key = localStorage.key(k);
                                if (key.substring(4,9) === 'radio') {
                                    let radio = `radioNum.${teams[i]}.${key.substring(2,3)}`;
                                    console.log(localStorage[key]);
                                    document.getElementById(radio).value = localStorage[key];
                                    document.getElementById(radio).dispatchEvent(event2);
                                    for (let l = 0; l < localStorage.length; l++ ) {
                                        let key = localStorage.key(l);
                                        if (key.substring(4,9) === 'guest') {
                                            let guest = `guest.${teams[i]}.${key.substring(2, 3)}`;
                                            console.log(localStorage[key]);
                                            document.getElementById(guest).value = localStorage[key];
                                            document.getElementById(guest).dispatchEvent(event2);
                                        }
                                    }
                                }
                            }
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