export function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

export function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function addTask(text) {
  const tasks = getTasks();
  tasks.push({ text, completed: false });
  saveTasks(tasks);
}

export function toggleTask(index, completed) {
  const tasks = getTasks();
  tasks[index].completed = completed;
  saveTasks(tasks);
}

export function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
}

export function reorderTasks(oldIndex, newIndex) {
  const tasks = getTasks();
  const [moved] = tasks.splice(oldIndex, 1);
  tasks.splice(newIndex, 0, moved);
  saveTasks(tasks);
}
