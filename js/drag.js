import { reorderTasks } from "./tasks.js";
import { renderTasks } from "./ui.js";

let draggedIndex = null;

export function enableDrag(li, index) {
  li.draggable = true;
  li.dataset.index = index;

  li.addEventListener("dragstart", () => {
    draggedIndex = index;
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault(); // Required to allow drop
  });

  li.addEventListener("drop", () => {
    const targetIndex = Number(li.dataset.index);

    if (draggedIndex !== targetIndex) {
      reorderTasks(draggedIndex, targetIndex);
      renderTasks();
    }
  });
}
