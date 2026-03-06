import { reorderTasks } from "./tasks.js";
import { renderTasks } from "./ui.js";

let draggedIndex = null;

export function enableDrag(li, index) {
  li.draggable = true;
  li.dataset.index = index;

  li.addEventListener("dragstart", () => {
    draggedIndex = index;
    li.classList.add("dragging");
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault(); // required for drop

    // remove previous indicators
    document.querySelectorAll(".drop-target").forEach((el) => {
      el.classList.remove("drop-target");
    });

    // show drop line on hovered task
    li.classList.add("drop-target");
  });

  li.addEventListener("drop", () => {
    const targetIndex = Number(li.dataset.index);

    if (draggedIndex !== targetIndex) {
      reorderTasks(draggedIndex, targetIndex);
      renderTasks();
    }
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");

    document.querySelectorAll(".drop-target").forEach((el) => {
      el.classList.remove("drop-target");
    });
  });
}
