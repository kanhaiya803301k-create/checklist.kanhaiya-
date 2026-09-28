const START_DATE=new Date(2026,8,28);
const tasks=["GATE Lecture 01","GATE Lecture 02","Drawing","Video Making","Semester Lecture","Robotics","Typing","Diary Writing"];
const DAYS_TO_SHOW=365;

function getMissionDate(){
 const now=new Date();
 // The user's "day" runs until 3:00 AM. Between midnight and 2:59:59 AM,
 // count it as the previous calendar day.
 if(now.getHours()<3) now.setDate(now.getDate()-1);
 return now;
}
function dateKey(date){return date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0")}
function storageKey(date,task){return `checklist_${date}_${task}`}
function isCompleted(date,task){return localStorage.getItem(storageKey(date,task))==="true"}
function saveTask(date,task,value){localStorage.setItem(storageKey(date,task),value)}

function generateTable(){
 const table=document.getElementById("checklistTable"),body=document.getElementById("taskBody");
 table.querySelector("thead tr").innerHTML='<th class="task-column">DAILY TASK</th>';body.innerHTML="";
 const today=getMissionDate(),todayKey=dateKey(today);
 for(let i=0;i<DAYS_TO_SHOW;i++){
   const date=new Date(START_DATE);date.setDate(START_DATE.getDate()+i);
   const key=dateKey(date),th=document.createElement("th");th.className="date-header";
   if(key===todayKey){th.classList.add("today-header");th.id="todayColumn"}
   th.innerHTML=`<div class="day">${date.toLocaleDateString("en-IN",{weekday:"short"})}</div><div class="date">${date.getDate()}</div><div class="month">${date.toLocaleDateString("en-IN",{month:"short"})}</div>`;
   table.querySelector("thead tr").appendChild(th);
 }
 tasks.forEach(task=>{
   const row=document.createElement("tr"),taskCell=document.createElement("td");taskCell.className="task-name";taskCell.textContent=task;row.appendChild(taskCell);
   for(let i=0;i<DAYS_TO_SHOW;i++){
     const date=new Date(START_DATE);date.setDate(START_DATE.getDate()+i);
     const key=dateKey(date),cell=document.createElement("td");cell.className="checkbox-cell";
     if(key===todayKey)cell.classList.add("today-column");
     const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.checked=isCompleted(key,task);
     if(checkbox.checked)cell.classList.add("completed");
     checkbox.addEventListener("change",()=>{saveTask(key,task,checkbox.checked);cell.classList.toggle("completed",checkbox.checked);updateDashboard()});
     cell.appendChild(checkbox);row.appendChild(cell);
   }
   body.appendChild(row);
 });
}

function updateDashboard(){
 const todayKey=dateKey(getMissionDate());let completed=0;
 tasks.forEach(task=>{if(isCompleted(todayKey,task))completed++});
 const percentage=Math.round(completed/tasks.length*100);
 document.getElementById("progressText").textContent=`${percentage}%`;
 document.getElementById("progressLabel").textContent=`${percentage}%`;
 document.getElementById("progressFill").style.width=`${percentage}%`;
 document.getElementById("todayText").textContent=getMissionDate().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
 document.getElementById("completedText").textContent=`${completed} / ${tasks.length}`;
 updateStreak();
}
function dayCompleted(date){return tasks.every(task=>isCompleted(dateKey(date),task))}
function updateStreak(){
 let streak=0,date=getMissionDate();
 while(dayCompleted(date)){streak++;date.setDate(date.getDate()-1)}
 document.getElementById("streakText").textContent=`${streak} Days`;
}
function updateClock(){
 const now=new Date();
 document.getElementById("liveDate").textContent=now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
 document.getElementById("liveTime").textContent=now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true});
}
function goToToday(){const col=document.getElementById("todayColumn");if(col)col.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}

generateTable();updateDashboard();updateClock();setInterval(updateClock,1000);setInterval(updateDashboard,30000);
