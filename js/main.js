import { addTask } from "./tasks.js";
import { renderTasks } from "./ui.js";
import { APP_VERSION } from "./config.js";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const versionEl = document.getElementById("appVersion");
versionEl.textContent = `App version: ${APP_VERSION}`;
console.log("SimpleAppsLab ToDo PWA v" + APP_VERSION);

// Initial render
renderTasks();

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = "";
  renderTasks();
});
