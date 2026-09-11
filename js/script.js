// ==========================================
// 1. CLOCK & GREETING (MVP & Challenge: Custom Name)
// ==========================================
function updateDateTime() {
  const now = new Date();
  
  // Time format (HH:MM:SS)
  const timeStr = now.toLocaleTimeString("en-GB");
  document.getElementById("currentTime").textContent = timeStr;

  // Date format (e.g., Tuesday, January 27, 2026)
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  document.getElementById("currentDate").textContent = now.toLocaleDateString("en-US", options);

  // Dynamic Greeting based on hour
  const hour = now.getHours();
  let greeting = "Good Evening";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  }
  document.getElementById("greetingText").textContent = greeting;
}

// User Name (Saved to Local Storage)
const userNameInput = document.getElementById("userNameInput");
userNameInput.value = localStorage.getItem("dashboard_username") || "Gilang";

userNameInput.addEventListener("change", () => {
  localStorage.setItem("dashboard_username", userNameInput.value.trim());
});

setInterval(updateDateTime, 1000);
updateDateTime();

// ==========================================
// 2. THEME MODE (Challenge: Light/Dark Mode)
// ==========================================
const themeToggleBtn = document.getElementById("themeToggleBtn");
const savedTheme = localStorage.getItem("dashboard_theme") || "light";

if (savedTheme === "dark") {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
  themeToggleBtn.textContent = "☀️ Light Mode";
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode", !isDark);
  themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("dashboard_theme", isDark ? "dark" : "light");
});

// ==========================================
// 3. FOCUS TIMER (MVP)
// ==========================================
let timerDuration = 25 * 60; // 25 minutes
let timerRemaining = timerDuration;
let timerInterval = null;

const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const stopTimerBtn = document.getElementById("stopTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

function updateTimerDisplay() {
  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

startTimerBtn.addEventListener("click", () => {
  if (timerInterval !== null) return;
  timerInterval = setInterval(() => {
    if (timerRemaining > 0) {
      timerRemaining--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Focus session complete!");
    }
  }, 1000);
});

stopTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRemaining = timerDuration;
  updateTimerDisplay();
});

updateTimerDisplay();

// ==========================================
// 4. TO-DO LIST (MVP & Challenge: Prevent Duplicate)
// ==========================================
let tasks = JSON.parse(localStorage.getItem("dashboard_tasks")) || [];

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskError = document.getElementById("taskError");

function saveTasks() {
  localStorage.setItem("dashboard_tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(index));

    const span = document.createElement("span");
    span.className = `task-text ${task.completed ? "completed" : ""}`;
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "btn secondary-btn btn-small";
    editBtn.addEventListener("click", () => editTask(index));

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "btn danger-btn btn-small";
    delBtn.addEventListener("click", () => deleteTask(index));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  taskError.textContent = "";

  if (!text) return;

  // Challenge: Prevent Duplicate Tasks
  const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    taskError.textContent = "Task with this name already exists!";
    return;
  }

  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const currentText = tasks[index].text;
  const newText = prompt("Edit your task:", currentText);
  if (newText !== null && newText.trim() !== "") {
    const isDuplicate = tasks.some((t, i) => i !== index && t.text.toLowerCase() === newText.trim().toLowerCase());
    if (isDuplicate) {
      alert("Another task with this name already exists.");
      return;
    }
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

todoForm.addEventListener("submit", addTask);
renderTasks();

// ==========================================
// 5. QUICK LINKS (MVP)
// ==========================================
let links = JSON.parse(localStorage.getItem("dashboard_links")) || [
  { name: "Google", url: "https://www.google.com" },
  { name: "Gmail", url: "https://mail.google.com" },
  { name: "Calendar", url: "https://calendar.google.com" }
];

const linkForm = document.getElementById("linkForm");
const linkNameInput = document.getElementById("linkNameInput");
const linkUrlInput = document.getElementById("linkUrlInput");
const linksContainer = document.getElementById("linksContainer");

function saveLinks() {
  localStorage.setItem("dashboard_links", JSON.stringify(links));
}

function renderLinks() {
  linksContainer.innerHTML = "";
  links.forEach((link, index) => {
    const chip = document.createElement("div");
    chip.className = "link-chip";

    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = link.name;

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "&times;";
    delBtn.title = "Remove link";
    delBtn.addEventListener("click", () => {
      links.splice(index, 1);
      saveLinks();
      renderLinks();
    });

    chip.appendChild(a);
    chip.appendChild(delBtn);
    linksContainer.appendChild(chip);
  });
}

linkForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let url = linkUrlInput.value.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  links.push({ name: linkNameInput.value.trim(), url });
  saveLinks();
  renderLinks();
  linkNameInput.value = "";
  linkUrlInput.value = "";
});

renderLinks();