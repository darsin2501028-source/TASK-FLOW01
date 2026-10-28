const STORAGE_KEY = "taskflow-student-tasks";

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("taskTitle");
const subjectInput = document.getElementById("taskSubject");
const dueInput = document.getElementById("taskDue");
const priorityInput = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const formHeading = document.getElementById("formHeading");
const saveButton = document.getElementById("saveButton");
const cancelEditButton = document.getElementById("cancelEdit");

let tasks = loadTasks();
let editingId = null;
let currentFilter = "all";

document.getElementById("todayLabel").textContent =
  new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

function formatDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate + "T00:00:00") < today;
}

function updateStats() {
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("pendingCount").textContent =
    tasks.filter(task => !task.completed).length;
  document.getElementById("completedCount").textContent =
    tasks.filter(task => task.completed).length;
}

function renderTasks() {
  updateStats();

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  taskList.innerHTML = "";
  emptyState.classList.toggle("hidden", visibleTasks.length > 0);

  visibleTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return b.createdAt - a.createdAt;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement("article");
    item.className = "task-item" + (task.completed ? " is-complete" : "");
    const overdueText = isOverdue(task) ? '<span class="overdue">Overdue</span>' : "";
    const subject = task.subject
      ? `<span>${escapeHTML(task.subject)}</span><span class="dot">•</span>`
      : "";

    item.innerHTML = `
      <input class="task-check" type="checkbox" aria-label="Mark ${escapeHTML(task.title)} complete" ${task.completed ? "checked" : ""}>
      <div class="task-content">
        <div class="task-title">${escapeHTML(task.title)}</div>
        <div class="task-meta">
          ${subject}
          <span>${formatDate(task.dueDate)}</span>
          ${overdueText}
        </div>
      </div>
      <div class="task-side">
        <span class="priority ${escapeHTML(task.priority)}">${escapeHTML(task.priority)}</span>
        <div class="task-actions">
          <button class="small-action edit-task" type="button">Edit</button>
          <button class="small-action delete-task" type="button">Delete</button>
        </div>
      </div>
    `;

    item.querySelector(".task-check").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    item.querySelector(".edit-task").addEventListener("click", () => startEditing(task.id));
    item.querySelector(".delete-task").addEventListener("click", () => deleteTask(task.id));
    taskList.appendChild(item);
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    return;
  }

  const taskDetails = {
    title,
    subject: subjectInput.value.trim(),
    dueDate: dueInput.value,
    priority: priorityInput.value
  };

  if (editingId) {
    tasks = tasks.map(task =>
      task.id === editingId ? { ...task, ...taskDetails } : task
    );
  } else {
    tasks.push({
      id: makeId(),
      ...taskDetails,
      completed: false,
      createdAt: Date.now()
    });
  }

  saveTasks();
  resetForm();
  renderTasks();
});

function startEditing(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;

  editingId = id;
  titleInput.value = task.title;
  subjectInput.value = task.subject;
  dueInput.value = task.dueDate;
  priorityInput.value = task.priority;
  formHeading.textContent = "Edit task";
  saveButton.textContent = "Save changes";
  cancelEditButton.classList.remove("hidden");
  titleInput.focus();
  document.querySelector(".form-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
  taskForm.reset();
  editingId = null;
  formHeading.textContent = "Add a task";
  saveButton.textContent = "Add task";
  cancelEditButton.classList.add("hidden");
}

function deleteTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  if (!window.confirm(`Delete "${task.title}"?`)) return;

  tasks = tasks.filter(item => item.id !== id);
  if (editingId === id) resetForm();
  saveTasks();
  renderTasks();
}

cancelEditButton.addEventListener("click", resetForm);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", function () {
    currentFilter = this.dataset.filter;
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.toggle("active", item === this);
    });
    renderTasks();
  });
});

document.getElementById("clearCompleted").addEventListener("click", function () {
  const completedCount = tasks.filter(task => task.completed).length;
  if (completedCount === 0) {
    alert("There are no completed tasks to clear.");
    return;
  }

  if (!window.confirm(`Remove ${completedCount} completed task(s)?`)) return;
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
