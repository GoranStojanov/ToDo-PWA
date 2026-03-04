const modal = document.getElementById("confirmModal");
const modalText = document.getElementById("modalText");
const modalCancel = document.getElementById("modalCancel");
const modalOk = document.getElementById("modalOk");

export function showConfirm(message) {
  return new Promise((resolve) => {
    modalText.textContent = message;
    modal.style.display = "flex";
    modalCancel.focus();

    function cleanup(result) {
      modal.style.display = "none";
      document.removeEventListener("keydown", handleKey);
      modalCancel.onclick = null;
      modalOk.onclick = null;
      resolve(result);
    }

    function handleKey(e) {
      if (e.key === "Escape") cleanup(false);
      if (e.key === "Enter") cleanup(true);
    }

    document.addEventListener("keydown", handleKey);
    modalCancel.onclick = () => cleanup(false);
    modalOk.onclick = () => cleanup(true);
  });
}
