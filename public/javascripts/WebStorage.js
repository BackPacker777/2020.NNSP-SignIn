export default class WebStorage{static populateLocalStorage(e){let t=`${e.TEAM}.${e.POSITION_TEAM}`;e.GUEST&&localStorage.setItem(`${t}.guest`,e.GUEST),localStorage.setItem(`${t}.id`,e.ID),localStorage.setItem(`${t}.radio`,e.RADIO),localStorage.setItem(`${t}.name`,e.NAME),localStorage.setItem(`${t}.rating`,e.RATING),localStorage.setItem(`${t}.time`,e.TIME),localStorage.setItem(`${t}.days`,e.DAYS),localStorage.setItem(`${t}.team`,e.TEAM),localStorage.setItem(`${t}.nights`,e.NIGHTS),localStorage.setItem(`${t}.halfDays`,e.HALF_DAYS),localStorage.setItem(`${t}.totalDays`,e.TOTAL_DAYS),localStorage.setItem(`${t}.snowmobile`,e.SNOWMOBILE),localStorage.setItem(`${t}.toboggan`,e.TOBOGGAN),localStorage.setItem(`${t}.scavenger`,e.SCAVENGER),localStorage.setItem(`${t}.cpr`,e.CPR),localStorage.setItem(`${t}.chair`,e.CHAIR),localStorage.setItem(`${t}.todayHalf`,e.TODAY_HALF),localStorage.setItem(`${t}.positionTeam`,e.POSITION_TEAM)}static checkLocalStorage(){return localStorage.length>0}static populateForm(e,t){let a=0,l=e=>{let t=new Event("click"),a=new Event("change");for(let l=0;l<e.length;l++){let o=1,g=20;for(;o<=g;){let g=`${e[l]}.${o}`;localStorage.getItem(`${g}.id`)&&(document.getElementById(`joinTeam.${e[l]}`).dispatchEvent(t),document.getElementById(`patrollerID.${g}`).value=localStorage.getItem(`${g}.id`),document.getElementById(`patrollerID.${g}`).readOnly=!0,document.getElementById(`time.${g}`).value=localStorage.getItem(`${g}.time`),document.getElementById(`patrollerID.${g}`).dispatchEvent(a),document.getElementById(`name.${g}`).value=localStorage.getItem(`${g}.name`),localStorage.getItem(`${g}.radio`)&&(document.getElementById(`radioNum.${g}`).value=localStorage.getItem(`${g}.radio`),document.getElementById(`radioNum.${g}`).dispatchEvent(a),document.dispatchEvent(a)),document.getElementById(`rating.${g}`).value=localStorage.getItem(`${g}.rating`),localStorage.getItem(`${g}.guest`)&&(document.getElementById(`guest.${g}`).value=localStorage.getItem(`${g}.guest`),document.getElementById(`guest.${g}`).dispatchEvent(a))),o++}}},o=[],g=new Event("click");for(let e=0;e<localStorage.length;e++){let t=localStorage.key(e);localStorage[t];"team"===t.substring(4,9)&&o.push(Number(localStorage[t])),t.substring(0,1)>0&&(a=1)}e?(console.log("Running Weekend"),l(o)):a&&!e?(console.log("Running !weekend & Day"),document.getElementById("weekendOverride").checked=!0,document.getElementById("weekendOverride").dispatchEvent(g),l(o)):"Day"===t&&(console.log("Running others"),l(o))}static purgeLocalStorage(){localStorage.clear()}}