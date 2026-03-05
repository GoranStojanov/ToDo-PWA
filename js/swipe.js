import { deleteTask } from "./tasks.js";
import { renderTasks } from "./ui.js";
import { showConfirm } from "./modal.js";

export function enableSwipe(li, index) {
  let startX = 0;
  let currentX = 0;
  let swiping = false;

  li.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    swiping = true;
  });

  li.addEventListener("touchmove", (e) => {
    if (!swiping) return;

    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX < 0) {
      li.style.transform = `translateX(${deltaX}px)`;
    }
  });

  li.addEventListener("touchend", async () => {
    if (!swiping) return;

    const deltaX = currentX - startX;

    if (deltaX < -80) {
      const confirmed = await showConfirm("Delete this task?");
      if (confirmed) {
        deleteTask(index);
        renderTasks();
        return;
      }
    }

    // Snap back
    li.style.transform = "";
    swiping = false;
  });
}
