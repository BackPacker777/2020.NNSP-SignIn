export default class WebStorage{static populateLocalStorage(e,t,a){if(a)localStorage.setItem("whichForm",a);else{let t=`${e.TEAM}.${e.POSITION_TEAM}`;e.GUEST&&localStorage.setItem(`${t}.guest`,e.GUEST),localStorage.setItem(`${t}.id`,e.ID),localStorage.setItem(`${t}.radio`,e.RADIO),localStorage.setItem(`${t}.name`,e.NAME),localStorage.setItem(`${t}.position`,e.LEADER),localStorage.setItem(`${t}.rating`,e.RATING),localStorage.setItem(`${t}.time`,e.TIME),localStorage.setItem(`${t}.days`,e.DAYS),localStorage.setItem(`${t}.team`,e.TEAM),localStorage.setItem(`${t}.nights`,e.NIGHTS),localStorage.setItem(`${t}.halfDays`,e.HALF_DAYS),localStorage.setItem(`${t}.totalDays`,e.TOTAL_DAYS),localStorage.setItem(`${t}.snowmobile`,e.SNOWMOBILE),localStorage.setItem(`${t}.toboggan`,e.TOBOGGAN),localStorage.setItem(`${t}.scavenger`,e.SCAVENGER),localStorage.setItem(`${t}.cpr`,e.CPR),localStorage.setItem(`${t}.chair`,e.CHAIR),localStorage.setItem(`${t}.todayHalf`,e.TODAY_HALF),localStorage.setItem(`${t}.positionTeam`,e.POSITION_TEAM)}}static checkLocalStorage(){return localStorage.length>1}static checkWhichForm(){return localStorage.getItem("whichForm")}static populateForm(e){let t=[],a=[1,1,1,1,1,1,1],l="",o=o=>{let g=new Event("click");for(let m=0;m<o.length;m++)if(localStorage.getItem(`${o[m]}.id`)){let c=localStorage.getItem(`${o[m]}.todayHalf`),r=o[m].substring(0,1);"night"===e?a[r]>8?document.getElementById(`joinTeam.${r}`).dispatchEvent(g):document.getElementById(`joinNight.${a[r]}`).classList.add("disabled"):document.getElementById(`joinTeam.${r}`).dispatchEvent(g),document.getElementById(`patrollerID.${r}.${a[r]}`).value=localStorage.getItem(`${o[m]}.id`),document.getElementById(`patrollerID.${r}.${a[r]}`).readOnly=!0,document.getElementById(`time.${r}.${a[r]}`).value=localStorage.getItem(`${o[m]}.time`),document.getElementById(`name.${r}.${a[r]}`).value=localStorage.getItem(`${o[m]}.name`),"true"===c&&(document.getElementById(`halfDay.${r}.${a[r]}`).checked=!0,document.getElementById(`halfDay.${r}.${a[r]}`).dispatchEvent(g)),localStorage.getItem(`${o[m]}.radio`)&&(document.getElementById(`radioNum.${r}.${a[r]}`).value=localStorage.getItem(`${o[m]}.radio`)),document.getElementById(`rating.${r}.${a[r]}`).value=localStorage.getItem(`${o[m]}.rating`),"night"===e&&(document.getElementById(`guest.${r}.${a[r]}`).disabled=!1),localStorage.getItem(`${o[m]}.guest`)&&(document.getElementById(`guest.${r}.${a[r]}`).value=localStorage.getItem(`${o[m]}.guest`)),localStorage.getItem(`${o[m]}.position`).length>2&&6===r&&(l=localStorage.getItem(`${o[m]}.position`),document.getElementById(`position.${r}.${a[r]}`).value=l);let I={ID:document.getElementById(`patrollerID.${r}.${a[r]}`).value,RADIO:document.getElementById(`radioNum.${r}.${a[r]}`).value,NAME:document.getElementById(`name.${r}.${a[r]}`).value,LEADER:l,RATING:document.getElementById(`rating.${r}.${a[r]}`).value,TIME:document.getElementById(`time.${r}.${a[r]}`).value,DAYS:localStorage.getItem(`${o[m]}.days`),TEAM:r,NIGHTS:localStorage.getItem(`${o[m]}.nights`),HALF_DAYS:localStorage.getItem(`${o[m]}.halfDays`),TOTAL_DAYS:localStorage.getItem(`${o[m]}.totalDays`),SNOWMOBILE:localStorage.getItem(`${o[m]}.snowmobile`),TOBOGGAN:localStorage.getItem(`${o[m]}.toboggan`),SCAVENGER:localStorage.getItem(`${o[m]}.scavenger`),CPR:localStorage.getItem(`${o[m]}.cpr`),CHAIR:localStorage.getItem(`${o[m]}.chair`),TODAY_HALF:c,POSITION_TEAM:a[r]};t.push(I),a[r]++}},g=[];for(let e=0;e<localStorage.length;e++){let t=localStorage.key(e);"team"===t.substring(4,9)&&g.push(t.substring(0,3))}new Event("click");return"weekend"===e?o(g):(e=>{o(e)})(g),t}static purgeLocalStorage(){localStorage.clear()}}