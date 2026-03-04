import { getTasks, saveTasks } from "./tasks.js";
import { renderTasks } from "./ui.js";

export function attachDrag(li) {
  const handle = li.querySelector(".drag-handle");
  let dragging = false;
  let startY = 0;
  let placeholder = null;

  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dragging = true;
    startY = e.clientY;

    li.classList.add("dragging");

    // Placeholder
    placeholder = document.createElement("li");
    placeholder.className = "placeholder";
    li.parentNode.insertBefore(placeholder, li.nextSibling);

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
  });

  function handleMove(e) {
    if (!dragging) return;
    const delta = e.clientY - startY;
    li.style.transform = `translateY(${delta}px)`;

    // Determine placeholder position
    const siblings = Array.from(li.parentNode.children).filter(
      (x) => x !== li && x !== placeholder,
    );

    for (let sib of siblings) {
      const rect = sib.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (e.clientY > mid && placeholder.nextSibling !== sib.nextSibling) {
        sib.parentNode.insertBefore(placeholder, sib.nextSibling);
      } else if (e.clientY < mid && placeholder.nextSibling !== sib) {
        sib.parentNode.insertBefore(placeholder, sib);
      }
    }
  }

  function handleUp() {
    if (!dragging) return;
    dragging = false;

    li.classList.remove("dragging");
    li.style.transform = "";

    placeholder.parentNode.insertBefore(li, placeholder);
    placeholder.remove();
    placeholder = null;

    // Update tasks order
    const newOrder = Array.from(li.parentNode.children).map((li) =>
      parseInt(li.dataset.index),
    );
    const tasks = getTasks();
    const newTasks = newOrder.map((i) => tasks[i]);
    saveTasks(newTasks);

    renderTasks();

    document.removeEventListener("pointermove", handleMove);
    document.removeEventListener("pointerup", handleUp);
  }
}
