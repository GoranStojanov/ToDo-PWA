import { addTask } from "./tasks.js";
import { renderTasks } from "./ui.js";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

// Initial render
renderTasks();

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = "";
  renderTasks();
});
