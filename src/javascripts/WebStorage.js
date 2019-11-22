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
        let counter = `${pageData.TEAM}.${pageData.TEAM_POSITION}`;
        localStorage.setItem(`id.${counter}`, pageData.ID);
        localStorage.setItem(`radio.${counter}`, pageData.RADIO);
        localStorage.setItem(`name.${counter}`, pageData.NAME);
        localStorage.setItem(`rating.${counter}`, pageData.RATING);
        localStorage.setItem(`time.${counter}`, pageData.TIME);
        localStorage.setItem(`days.${counter}`, pageData.DAYS);
        localStorage.setItem(`team.${counter}`, pageData.TEAM);
        localStorage.setItem(`nights.${counter}`, pageData.NIGHTS);
        localStorage.setItem(`halfDays.${counter}`, pageData.HALF_DAYS);
        localStorage.setItem(`totalDays.${counter}`, pageData.TOTAL_DAYS);
        localStorage.setItem(`snowmobile.${counter}`, pageData.SNOWMOBILE);
        localStorage.setItem(`toboggan.${counter}`, pageData.TOBOGGAN);
        localStorage.setItem(`splint.${counter}`, pageData.SPLINT);
        localStorage.setItem(`cpr.${counter}`, pageData.CPR);
        localStorage.setItem(`chair.${counter}`, pageData.CHAIR);
        localStorage.setItem(`todayHalf.${counter}`, pageData.TODAY_HALF);
        localStorage.setItem(`guest.${counter}`, pageData.GUEST);
        localStorage.setItem(`teamPosition.${counter}`, pageData.TEAM_POSITION);
    }

    /**
     * Get all localStorage items
     * @return boolean
     */
    static localStorageExists() {
        return localStorage.length > 0;
    }

    /**
     * Get all localStorage items
     * @return null
     */
    static populateForm() {
        for (let i = 0; i < localStorage.length; i++ ) {
            let key = localStorage.key(i);
            let value = localStorage[key];
            console.log(`${key}: ${value}`);
        }
    }

    /**
     * Clear localStorage
     */
    static purgeLocalStorage() {
        localStorage.clear();
    }
}