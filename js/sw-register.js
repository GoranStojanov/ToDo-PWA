if ("serviceWorker" in navigator && location.hostname !== "localhost") {
  navigator.serviceWorker
    .register("service-worker-built.js")
    .then((registration) => {
      console.log("Service Worker Registered");

      registration.onupdatefound = () => {
        const newWorker = registration.installing;

        newWorker.onstatechange = () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            showUpdateBanner(registration);
          }
        };
      };
    });
}

// banner logic and controllerchange listener remain the same

// ----------------------
// Function to show update banner
// ----------------------
function showUpdateBanner(registration) {
  const banner = document.createElement("div");
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #222;
      color: white;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
    ">
      New version available!
      <button id="refreshApp" style="
        background: #4caf50;
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      ">Refresh</button>
      <button id="dismissUpdate" style="
        background: #888;
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      ">Dismiss</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById("refreshApp").onclick = () => {
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  };

  document.getElementById("dismissUpdate").onclick = () => {
    banner.remove();
  };
}

// ----------------------
// Optional: listen for SW messages to reload page automatically
// ----------------------
navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.location.reload();
});
