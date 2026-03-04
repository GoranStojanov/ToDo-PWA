// ----------------------
// Modal elements
// ----------------------
const modal = document.getElementById("confirmModal");
const modalText = document.getElementById("modalText");
const modalCancel = document.getElementById("modalCancel");
const modalOk = document.getElementById("modalOk");

// Show custom confirm modal
function showConfirm(message) {
  return new Promise((resolve) => {
    modalText.textContent = message;
    modal.style.display = "flex";

    // Focus Cancel by default
    modalCancel.focus();

    // Cleanup function to remove listeners and hide modal
    function cleanup(result) {
      modal.style.display = "none";
      document.removeEventListener("keydown", handleKey);
      modalCancel.onclick = null;
      modalOk.onclick = null;
      resolve(result);
    }

    // Keyboard handler
    function handleKey(e) {
      if (e.key === "Escape") cleanup(false); // Cancel
      if (e.key === "Enter") cleanup(true); // OK
    }

    document.addEventListener("keydown", handleKey);

    modalCancel.onclick = () => cleanup(false);
    modalOk.onclick = () => cleanup(true);
  });
}

// ----------------------
// Task app elements
// ----------------------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// ----------------------
// Version badge (hardcoded)
// ----------------------
const cacheVersion = "v3.1"; // Must match service-worker.js CACHE_NAME suffix
const appVersionElement = document.getElementById("appVersion");
appVersionElement.textContent = `App version: ${cacheVersion}`;

// ----------------------
// Load tasks from localStorage
// ----------------------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ----------------------
// Render tasks
// ----------------------
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;

    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "flex-start";
    li.style.gap = "8px";

    // ----------------------
    // Drag Handle
    // ----------------------
    const dragHandle = document.createElement("span");
    dragHandle.textContent = "☰";
    dragHandle.style.cursor = "grab";
    dragHandle.style.fontWeight = "bold";
    dragHandle.style.userSelect = "none";

    let startY = 0;
    let draggingIndex = null;

    dragHandle.addEventListener("pointerdown", (e) => {
      startY = e.clientY;
      draggingIndex = index;
      li.classList.add("dragging");
      dragHandle.style.cursor = "grabbing";
      document.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerup", handleUp);
    });

    function handleMove(e) {
      const delta = e.clientY - startY;

      if (Math.abs(delta) > 25) {
        const direction = delta > 0 ? 1 : -1;
        const newIndex = draggingIndex + direction;

        if (newIndex >= 0 && newIndex < tasks.length) {
          const movedTask = tasks.splice(draggingIndex, 1)[0];
          tasks.splice(newIndex, 0, movedTask);
          draggingIndex = newIndex;
          startY = e.clientY;

          saveTasks();
          renderTasks();
        }
      }
    }

    function handleUp() {
      li.classList.remove("dragging");
      dragHandle.style.cursor = "grab";
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    }

    // ----------------------
    // Checkbox
    // ----------------------
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      li.classList.toggle("completed", checkbox.checked);
    });

    // ----------------------
    // Task Text
    // ----------------------
    const span = document.createElement("span");
    span.textContent = task.text;

    // ----------------------
    // Delete Button
    // ----------------------
    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "❌";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.marginLeft = "auto";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showConfirm(`Are you sure you want to delete "${task.text}"?`).then(
        (confirmed) => {
          if (confirmed) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
          }
        },
      );
    });

    li.appendChild(dragHandle);
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    li.classList.toggle("completed", task.completed);
    taskList.appendChild(li);
  });
}

// ----------------------
// Add new task
// ----------------------
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// ----------------------
// Initial render
// ----------------------
renderTasks();

// ----------------------
// Register service worker
// ----------------------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}
