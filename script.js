// Read saved records safely from this browser.
function loadData(key, defaultValue) {
  try {
    var savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

// These arrays store the project records.
var athletes = loadData("lpuAthletes", [
  {name: "Aman Kumar", age: 19, sport: "Cricket"},
  {name: "Priya Sharma", age: 18, sport: "Badminton"},
  {name: "Rahul Singh", age: 20, sport: "Football"},
  {name: "Nigesh Kumar", age: 21, sport: "Football"},
  {name: "Neha Singh", age: 21, sport: "Football"}
]);
var coaches = loadData("lpuCoaches", [
  {name: "Coach Gaurav", sport: "Football", experience: 5},
  {name: "Coach Harnoor", sport: "Cricket", experience: 4},
  {name: "Coach Surya", sport: "Badminton", experience: 3}
]);
var attendance = loadData("lpuAttendance", []);
var performances = loadData("lpuPerformances", []);
var batches = loadData("lpuBatches", []);
var sessions = loadData("lpuSessions", []);

// This function changes the visible page.
function showPage(pageName, button) {
  var pages = document.getElementsByClassName("page");
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove("show");
  }
  document.getElementById(pageName).classList.add("show");

  var buttons = document.getElementsByClassName("nav");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("active");
  }
  if (button) {
    button.classList.add("active");
  }
}

// Save all records in browser LocalStorage.
function saveData() {
  localStorage.setItem("lpuAthletes", JSON.stringify(athletes));
  localStorage.setItem("lpuCoaches", JSON.stringify(coaches));
  localStorage.setItem("lpuAttendance", JSON.stringify(attendance));
  localStorage.setItem("lpuPerformances", JSON.stringify(performances));
  localStorage.setItem("lpuBatches", JSON.stringify(batches));
  localStorage.setItem("lpuSessions", JSON.stringify(sessions));
}

// Add an athlete to the athletes array.
function addAthlete() {
  var name = document.getElementById("aName").value;
  var age = document.getElementById("aAge").value;
  var sport = document.getElementById("aSport").value;

  if (name === "" || age === "" || sport === "") {
    alert("Please fill all athlete details.");
    return;
  }

  athletes.push({name: name, age: Number(age), sport: sport});
  saveData();
  displayAthletes();
  document.getElementById("aName").value = "";
  document.getElementById("aAge").value = "";
  document.getElementById("aSport").value = "";
  alert("Athlete added successfully.");
}

// Show athletes inside the HTML table.
function displayAthletes(list) {
  var table = document.getElementById("athleteRows");
  var records = list || athletes;
  table.innerHTML = "";

  for (var i = 0; i < records.length; i++) {
    var originalIndex = athletes.indexOf(records[i]);
    table.innerHTML += "<tr><td>" + records[i].name + "</td><td>" +
      records[i].age + "</td><td>" + records[i].sport +
      "</td><td><button class='delete' onclick='deleteAthlete(" +
      originalIndex + ")'>Delete</button></td></tr>";
  }
  updateDashboard();
  fillAthleteMenus();
}

// Remove one athlete from the array.
function deleteAthlete(index) {
  athletes.splice(index, 1);
  saveData();
  displayAthletes();
}

// Search athlete names and sports.
function searchAthletes() {
  var text = document.getElementById("aSearch").value.toLowerCase();
  var result = [];
  for (var i = 0; i < athletes.length; i++) {
    if (athletes[i].name.toLowerCase().includes(text) ||
        athletes[i].sport.toLowerCase().includes(text)) {
      result.push(athletes[i]);
    }
  }
  displayAthletes(result);
}

// Add a coach.
function addCoach() {
  var name = document.getElementById("cName").value;
  var sport = document.getElementById("cSport").value;
  var experience = document.getElementById("cExp").value;
  if (name === "" || sport === "" || experience === "") {
    alert("Please fill all coach details.");
    return;
  }
  coaches.push({name: name, sport: sport, experience: Number(experience)});
  saveData();
  displayCoaches();
  document.getElementById("cName").value = "";
  document.getElementById("cSport").value = "";
  document.getElementById("cExp").value = "";
  alert("Coach added successfully.");
}

// Display coach records.
function displayCoaches() {
  var table = document.getElementById("coachRows");
  table.innerHTML = "";
  for (var i = 0; i < coaches.length; i++) {
    table.innerHTML += "<tr><td>" + coaches[i].name + "</td><td>" +
      coaches[i].sport + "</td><td>" + coaches[i].experience +
      " years</td><td><button class='delete' onclick='deleteCoach(" +
      i + ")'>Delete</button></td></tr>";
  }
  updateDashboard();
}

// Delete a coach.
function deleteCoach(index) {
  coaches.splice(index, 1);
  saveData();
  displayCoaches();
}

// Add current athletes to attendance and performance dropdowns.
function fillAthleteMenus() {
  var menu1 = document.getElementById("attAthlete");
  var menu2 = document.getElementById("pAthlete");
  menu1.innerHTML = "";
  menu2.innerHTML = "";
  for (var i = 0; i < athletes.length; i++) {
    menu1.innerHTML += "<option>" + athletes[i].name + "</option>";
    menu2.innerHTML += "<option>" + athletes[i].name + "</option>";
  }
}

// Save attendance for an athlete.
function markAttendance() {
  if (athletes.length === 0) {
    alert("Add an athlete first.");
    return;
  }
  var name = document.getElementById("attAthlete").value;
  var status = document.getElementById("attStatus").value;
  var date = new Date().toLocaleDateString();
  attendance.push({name: name, status: status, date: date});
  saveData();
  displayAttendance();
  alert("Attendance saved.");
}

// Display attendance records.
function displayAttendance() {
  var table = document.getElementById("attendanceRows");
  table.innerHTML = "";
  for (var i = 0; i < attendance.length; i++) {
    table.innerHTML += "<tr><td>" + attendance[i].name + "</td><td>" +
      attendance[i].status + "</td><td>" + attendance[i].date + "</td></tr>";
  }
}

// Save a performance score.
function addPerformance() {
  if (athletes.length === 0) {
    alert("Add an athlete first.");
    return;
  }
  var athlete = document.getElementById("pAthlete").value;
  var test = document.getElementById("pTest").value;
  var score = Number(document.getElementById("pScore").value);

  if (test === "" || document.getElementById("pScore").value === "") {
    alert("Enter test name and score.");
    return;
  }
  if (score < 0 || score > 100) {
    alert("Score must be between 0 and 100.");
    return;
  }
  performances.push({athlete: athlete, test: test, score: score});
  saveData();
  displayPerformances();
  document.getElementById("pTest").value = "";
  document.getElementById("pScore").value = "";
  alert("Performance saved.");
}

// Display performance records.
function displayPerformances() {
  var table = document.getElementById("performanceRows");
  table.innerHTML = "";
  for (var i = 0; i < performances.length; i++) {
    table.innerHTML += "<tr><td>" + performances[i].athlete + "</td><td>" +
      performances[i].test + "</td><td>" + performances[i].score +
      " / 100</td><td><button class='delete' onclick='deletePerformance(" +
      i + ")'>Delete</button></td></tr>";
  }
}

// Delete one performance record.
function deletePerformance(index) {
  performances.splice(index, 1);
  saveData();
  displayPerformances();
}

// Update the dashboard numbers.
function updateDashboard() {
  document.getElementById("athleteCount").innerText = athletes.length;
  document.getElementById("coachCount").innerText = coaches.length;
}


// Add a training batch.
function addBatch() {
  var name = document.getElementById("bName").value;
  var sport = document.getElementById("bSport").value;
  var coach = document.getElementById("bCoach").value;
  var time = document.getElementById("bTime").value;
  if (name === "" || sport === "" || coach === "" || time === "") {
    alert("Please fill all batch details.");
    return;
  }
  batches.push({name: name, sport: sport, coach: coach, time: time});
  saveData();
  displayBatches();
  document.getElementById("bName").value = "";
  document.getElementById("bSport").value = "";
  document.getElementById("bCoach").value = "";
  document.getElementById("bTime").value = "";
}

// Display training batches.
function displayBatches() {
  var table = document.getElementById("batchRows");
  table.innerHTML = "";
  for (var i = 0; i < batches.length; i++) {
    table.innerHTML += "<tr><td>" + batches[i].name + "</td><td>" +
      batches[i].sport + "</td><td>" + batches[i].coach + "</td><td>" +
      batches[i].time + "</td><td><button class='delete' onclick='deleteBatch(" +
      i + ")'>Delete</button></td></tr>";
  }
}

function deleteBatch(index) {
  batches.splice(index, 1);
  saveData();
  displayBatches();
}

// Add a training session.
function addSession() {
  var day = document.getElementById("sDay").value;
  var sport = document.getElementById("sSport").value;
  var time = document.getElementById("sTime").value;
  var place = document.getElementById("sPlace").value;
  if (sport === "" || time === "" || place === "") {
    alert("Please fill all session details.");
    return;
  }
  sessions.push({day: day, sport: sport, time: time, place: place});
  saveData();
  displaySchedule();
  document.getElementById("sSport").value = "";
  document.getElementById("sTime").value = "";
  document.getElementById("sPlace").value = "";
}

// Display weekly sessions.
function displaySchedule() {
  var table = document.getElementById("scheduleRows");
  table.innerHTML = "";
  for (var i = 0; i < sessions.length; i++) {
    table.innerHTML += "<tr><td>" + sessions[i].day + "</td><td>" +
      sessions[i].sport + "</td><td>" + sessions[i].time + "</td><td>" +
      sessions[i].place + "</td><td><button class='delete' onclick='deleteSession(" +
      i + ")'>Delete</button></td></tr>";
  }
}

function deleteSession(index) {
  sessions.splice(index, 1);
  saveData();
  displaySchedule();
}

// Run these functions when the website first opens.
displayAthletes();
displayCoaches();
displayAttendance();
displayPerformances();
fillAthleteMenus();
updateDashboard();


// Reveal the main sports management website after the welcome screen.
function enterDashboard() {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("appShell").classList.add("app-visible");
}
