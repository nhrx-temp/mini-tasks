const API_URL = "/api";
let token = localStorage.getItem("token") || null;
let currentUser = JSON.parse(localStorage.getItem("user")) || null;

// DOM Elements
const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");
const authNav = document.getElementById("authNav");
const authAlert = document.getElementById("authAlert");

function init() {
  if (token && currentUser) {
    authSection.classList.add("d-none");
    dashboardSection.classList.remove("d-none");
    authNav.innerHTML = `
      <span class="text-secondary">Welcome, <strong>${currentUser.username}</strong></span>
      <button class="btn btn-outline-danger btn-sm" onclick="logout()">Logout</button>
    `;
    fetchTasks();
  } else {
    authSection.classList.remove("d-none");
    dashboardSection.classList.add("d-none");
    authNav.innerHTML = "";
  }
}

function showAlert(msg) {
  authAlert.textContent = msg;
  authAlert.classList.remove("d-none");
  setTimeout(() => authAlert.classList.add("d-none"), 4000);
}

// Auth Actions
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    handleAuthSuccess(data);
  } catch (err) { showAlert(err.message); }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    handleAuthSuccess(data);
  } catch (err) { showAlert(err.message); }
});

function handleAuthSuccess(data) {
  token = data.token;
  currentUser = data.user;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(currentUser));
  init();
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  init();
}

// Task Operations
async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) renderTasks(data.tasks);
  } catch (err) { console.error(err); }
}

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const status = document.getElementById("taskStatus").value;
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, status })
    });
    if (res.ok) {
      document.getElementById("taskTitle").value = "";
      fetchTasks();
    }
  } catch (err) { console.error(err); }
});

async function updateTaskStatus(id, newStatus) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
  } catch (err) { console.error(err); }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchTasks();
  } catch (err) { console.error(err); }
}

function renderTasks(tasks) {
  const colTodo = document.getElementById("colTodo");
  const colDoing = document.getElementById("colDoing");
  const colDone = document.getElementById("colDone");

  colTodo.innerHTML = "";
  colDoing.innerHTML = "";
  colDone.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "card bg-dark border-secondary mb-2 p-2 shadow-sm";
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <span class="text-light small text-break">${escapeHtml(task.title)}</span>
        <button class="btn btn-sm text-danger p-0 ms-2" onclick="deleteTask('${task._id}')"><i class="bi bi-trash"></i></button>
      </div>
      <div class="mt-2 d-flex justify-content-between align-items-center">
        <select class="form-select form-select-sm bg-black text-light border-secondary w-auto" onchange="updateTaskStatus('${task._id}', this.value)">
          <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
          <option value="doing" ${task.status === 'doing' ? 'selected' : ''}>Doing</option>
          <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
        </select>
      </div>
    `;

    if (task.status === "todo") colTodo.appendChild(card);
    else if (task.status === "doing") colDoing.appendChild(card);
    else if (task.status === "done") colDone.appendChild(card);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initialize on load
init();
