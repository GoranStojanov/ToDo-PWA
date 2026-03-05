import { getTasks, toggleTask, deleteTask } from "./tasks.js";
import { showConfirm } from "./modal.js";
import { enableDrag } from "./drag.js";

const taskList = document.getElementById("taskList");

export function renderTasks() {
  taskList.innerHTML = "";

  getTasks().forEach((task, index) => {
    const li = document.createElement("li");
    li.dataset.index = index; // important for drag order

    // Drag handle
    const dragHandle = document.createElement("span");
    dragHandle.textContent = "☰";
    dragHandle.classList.add("drag-handle");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // Delete button
    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");

    // Append elements
    li.appendChild(dragHandle);
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // Checkbox toggle
    checkbox.addEventListener("change", () => {
      toggleTask(index, checkbox.checked);
      li.classList.toggle("completed", checkbox.checked);
    });

    // Delete button
    deleteBtn.addEventListener("click", async () => {
      const confirmed = await showConfirm(
        `Are you sure you want to delete "${task.text}"?`,
      );
      if (confirmed) {
        deleteTask(index);
        renderTasks();
      }
    });

    // Enable drag AFTER dataset.index is set
    enableDrag(li, index);

    // Completed styling
    li.classList.toggle("completed", task.completed);

    taskList.appendChild(li);
  });
}
