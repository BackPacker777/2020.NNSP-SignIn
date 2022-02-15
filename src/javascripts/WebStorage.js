/**
 *  WebStorage class
 *  @desc Used to persist form data until explicitly cleared. Prevents data loss due to accidental form closure
 *  @export
 */
export default class WebStorage {
    /**
     * @param pageData
     * @param count
     * @param whichForm
     */
    static populateLocalStorage(pageData, count, whichForm) {
        if (whichForm) {
            localStorage.setItem("whichForm", whichForm);
        } else {
            let counter = `${pageData.TEAM}.${pageData.POSITION_TEAM}`;
            if (pageData.GUEST) {
                localStorage.setItem(`${counter}.guest`, pageData.GUEST);
            }
            localStorage.setItem(`${counter}.id`, pageData.ID);
            localStorage.setItem(`${counter}.radio`, pageData.RADIO);
            localStorage.setItem(`${counter}.name`, pageData.NAME);
            localStorage.setItem(`${counter}.position`, pageData.LEADER);
            localStorage.setItem(`${counter}.rating`, pageData.RATING);
            localStorage.setItem(`${counter}.time`, pageData.TIME);
            localStorage.setItem(`${counter}.days`, pageData.DAYS);
            localStorage.setItem(`${counter}.team`, pageData.TEAM);
            localStorage.setItem(`${counter}.nights`, pageData.NIGHTS);
            localStorage.setItem(`${counter}.halfDays`, pageData.HALF_DAYS);
            localStorage.setItem(`${counter}.totalDays`, pageData.TOTAL_DAYS);
            localStorage.setItem(`${counter}.snowmobile`, pageData.SNOWMOBILE);
            localStorage.setItem(`${counter}.toboggan`, pageData.TOBOGGAN);
            localStorage.setItem(`${counter}.scavenger`, pageData.SCAVENGER);
            localStorage.setItem(`${counter}.cpr`, pageData.CPR);
            localStorage.setItem(`${counter}.chair`, pageData.CHAIR);
            localStorage.setItem(`${counter}.todayHalf`, pageData.TODAY_HALF);
            localStorage.setItem(`${counter}.positionTeam`, pageData.POSITION_TEAM);
        }
    }

    /**
     * Get all localStorage items
     * @return boolean
     */
    static checkLocalStorage() {
        return localStorage.length > 1;
    }

    static checkWhichForm() {
        return localStorage.getItem("whichForm");
    }

    /**
     * Get all localStorage items
     * @return null
     */
    static populateForm(whichForm) {
        const LEADERS = 6, MAX_NIGHT = 8;
        let patrollers = [];
        let teamPosition = [1,1,1,1,1,1,1];
        let leader = "";
        let runWeekendPopulate = (teams) => {
            let event = new Event('click');
            for (let i = 0; i < teams.length; i++) {
                if (localStorage.getItem(`${teams[i]}.id`)) {
                    let isHalf = localStorage.getItem(`${teams[i]}.todayHalf`);
                    let team = teams[i].substring(0,1);
                    if (whichForm === "night") {
                        if (teamPosition[team] > MAX_NIGHT) {
                            document.getElementById(`joinTeam.${team}`).dispatchEvent(event);
                        }
                    } else {
                        document.getElementById(`joinTeam.${team}`).dispatchEvent(event);
                    }
                    document.getElementById(`patrollerID.${team}.${teamPosition[team]}`).value = localStorage.getItem(`${teams[i]}.id`);
                    document.getElementById(`patrollerID.${team}.${teamPosition[team]}`).readOnly = true;
                    document.getElementById(`time.${team}.${teamPosition[team]}`).value = localStorage.getItem(`${teams[i]}.time`);
                    document.getElementById(`name.${team}.${teamPosition[team]}`).value = localStorage.getItem(`${teams[i]}.name`);
                    if (isHalf === "true") {
                        // console.log(localStorage.getItem(`${teams[i]}.todayHalf`));
                        document.getElementById(`halfDay.${team}.${teamPosition[team]}`).checked = true;
                        document.getElementById(`halfDay.${team}.${teamPosition[team]}`).dispatchEvent(event);
                    }
                    if (localStorage.getItem(`${teams[i]}.radio`)) {
                        document.getElementById(`radioNum.${team}.${teamPosition[team]}`).value = localStorage.getItem(`${teams[i]}.radio`);
                        /*document.getElementById(`radioNum.${teams[i]}`).dispatchEvent(event2);
                        document.dispatchEvent(event2);*/
                    }
                    document.getElementById(`rating.${team}.${teamPosition[team]}`).value = localStorage.getItem(`${teams[i]}.rating`);
                    if (whichForm === "night") {
                        document.getElementById(`guest.${team}.${teamPosition[team]}`).disabled = false;
                    }
                    if (localStorage.getItem(`${teams[i]}.guest`)) {
                        document.getElementById(`guest.${team}.${teamPosition[team]}`).value = localStorage.getItem(`${teams[i]}.guest`);
                        // document.getElementById(`guest.${teams[i]}`).dispatchEvent(event2);
                    }
                    // console.log(teamPosition[team]);
                    if (localStorage.getItem(`${teams[i]}.position`).length > 2 && team === LEADERS) {
                        leader = localStorage.getItem(`${teams[i]}.position`);
                        console.log(`position.${team}.${teamPosition[team]}`);
                        document.getElementById(`position.${team}.${teamPosition[team]}`).value = leader;
                    }
                    let patroller = {
                        ID: document.getElementById(`patrollerID.${team}.${teamPosition[team]}`).value,
                        RADIO: document.getElementById(`radioNum.${team}.${teamPosition[team]}`).value,
                        NAME: document.getElementById(`name.${team}.${teamPosition[team]}`).value,
                        LEADER: leader,
                        RATING: document.getElementById(`rating.${team}.${teamPosition[team]}`).value,
                        TIME: document.getElementById(`time.${team}.${teamPosition[team]}`).value,
                        DAYS: localStorage.getItem(`${teams[i]}.days`),
                        TEAM: team,
                        NIGHTS: localStorage.getItem(`${teams[i]}.nights`),
                        HALF_DAYS: localStorage.getItem(`${teams[i]}.halfDays`),
                        TOTAL_DAYS: localStorage.getItem(`${teams[i]}.totalDays`),
                        SNOWMOBILE: localStorage.getItem(`${teams[i]}.snowmobile`),
                        TOBOGGAN: localStorage.getItem(`${teams[i]}.toboggan`),
                        SCAVENGER: localStorage.getItem(`${teams[i]}.scavenger`),
                        CPR: localStorage.getItem(`${teams[i]}.cpr`),
                        CHAIR: localStorage.getItem(`${teams[i]}.chair`),
                        TODAY_HALF: isHalf,
                        POSITION_TEAM: teamPosition[team]
                    };
                    patrollers.push(patroller);
                    // console.log(patrollers);
                    teamPosition[team]++;
                    // console.log(teamPosition[team]);
                }
            }
        };

        let runWeekdayPopulate = (teams) => {
            runWeekendPopulate(teams);
        };

        let runNightPopulate = (teams) => {
            runWeekendPopulate(teams);
        };

        let teams = [];
        for (let i = 0; i < localStorage.length; i++ ) {
            let key = localStorage.key(i);
            if (key.substring(4,9) === 'team') {
                teams.push(key.substring(0,3));
                // console.log(teams);
            }
        }
        let event = new Event('click');
        if (whichForm === "weekend") {
            runWeekendPopulate(teams);
        } else if (whichForm === "weekday") {
            runWeekdayPopulate(teams);
        } else  {
            runNightPopulate(teams);
        }
        return patrollers;
    }

    /**
     * Clear localStorage
     */
    static purgeLocalStorage() {
        localStorage.clear();
    }
}