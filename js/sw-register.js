import { APP_VERSION } from "./config.js";

if ("serviceWorker" in navigator && location.hostname !== "localhost") {
  navigator.serviceWorker.register("service-worker.js").then((reg) => {
    console.log("Service Worker Registered (App v" + APP_VERSION + ")");

    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          showUpdateBanner();
        }
      });
    });
  });
}

function showUpdateBanner() {
  const banner = document.createElement("div");

  banner.innerHTML = `
    New version available.
    <button id="refreshApp">Refresh</button>
  `;

  banner.style.position = "fixed";
  banner.style.bottom = "20px";
  banner.style.left = "50%";
  banner.style.transform = "translateX(-50%)";
  banner.style.background = "#333";
  banner.style.color = "white";
  banner.style.padding = "10px 16px";
  banner.style.borderRadius = "6px";
  banner.style.zIndex = "2000";

  document.body.appendChild(banner);

  document.getElementById("refreshApp").onclick = () => {
    location.reload();
  };
}
