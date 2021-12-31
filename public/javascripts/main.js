"use strict";import DivContents from"./DivContents2.js";import EventHandler from"./EventHandler.js";class Main{constructor(e){this.date=new Date,this.isWeekend=this.determineWeekend(),document.getElementById("date").innerText=this.getWeekDay(),document.getElementById("weekDay").innerText=`${this.date.getMonth()+1}/${this.date.getDate()}/${this.date.getFullYear()}`,document.getElementById("dayNight").innerText=`${this.getDayNight()} Shift`,this.eventHandler=new EventHandler(e,this.getDayNight(),this.isWeekend,["Snowmobile","Toboggan","Scavenger","Cpr","Chair"]),this.prepUX()}determineWeekend(){if(6===this.date.getDay()||0===this.date.getDay())return!0}getWeekDay(){return["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.date.getDay()]}getDayNight(){let e;return e=this.date.getHours()>14&&this.date.getHours()<23?"Night":"Day",e="Night",e}prepUX(){if(document.getElementById("noPrint").style.display="none",document.getElementById("narniaDiv").style.display="none",document.getElementById("formSubmit").disabled=!0,"Night"===this.getDayNight()){let e=1;const t=["","7:00","7:15","7:30","7:45","8:00","8:15","8:30","8:45"];let n=document.querySelectorAll("fieldset");for(let e=1;e<n.length;e++)document.getElementById(`team.${e}`).style.display="none";for(;e<t.length;)document.getElementById("team.0").insertAdjacentHTML("beforeend",DivContents.getNightRaceDivs(0,e,t)),DivContents.getDivs(0,e,null,t),this.eventHandler.changePatrollerDiv(0,e),e++;document.getElementById("patrollerID.0.1").required=!0,document.getElementById("joinTeam.0").value="EXTRA Sign On (! ONLY click this if all race time slots are filled or you cannot do race course duty !)"}else if("Day"===this.getDayNight()&&this.isWeekend)document.getElementById("team.0").style.display="none";else{let e=document.querySelectorAll("fieldset");for(let t=1;t<e.length;t++)document.getElementById(`team.${t}`).style.display="none"}if(this.eventHandler.populatePage(),1===this.eventHandler.populated){let e=new Event("change");document.dispatchEvent(e)}}static async populatePatrollers(){return(await fetch("/data/patrollers.csv",{method:"post",headers:{"x-requested-with":"fetch.0"}})).text()}}window.addEventListener("load",(()=>{Main.populatePatrollers().then((e=>{e=JSON.parse(e),new Main(e)}))}));