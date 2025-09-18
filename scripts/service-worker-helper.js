import { Alert } from "/T007_TOOLS/T007_dialog_library/T007_dialog.js";

export async function registerTasteyServiceWorker() {
  if ("serviceWorker" in navigator)
    await navigator.serviceWorker
      .register("Tastey_service_worker.js")
      .catch((error) => console.log("Registration failed with " + error));
  else console.error("Service workers are not supported.");
}

export function notificationQuery(title, options, type = "") {
  options.icon = "assets/tastey-meal-icons/tastey-icon.jpeg";
  options.badge = "assets/tastey-meal-icons/tastey-icon.png";
  options.actions = [
    {
      action: "open-reservation",
      title: "Reservation",
      type: "button",
      icon: "assets/tastey-meal-icons/reservation-icon.png",
    },
    {
      action: "open-menu",
      title: "Open Menu",
      type: "button",
      icon: "assets/tastey-meal-icons/menu-icon.svg",
    },
  ];
  if (Notification?.permission === "granted") {
    registerTasteyServiceWorker();
    navigator.serviceWorker.ready.then((registration) =>
      registration.showNotification(title, options)
    );
  } else if (Notification && Notification?.permission !== "denied") {
    Notification.requestPermission().then((status) => {
      if (status === "granted") {
        registerTasteyServiceWorker();
        navigator.serviceWorker.ready.then((registration) =>
          registration.showNotification(title, options)
        );
      } else {
        Alert(
          `You have to give notification permission to get the Tastey ${type} Notification`
        );
      }
    });
  } else {
    Alert(
      `You have to give notification permission to get the Tastey ${type} Notification`
    );
  }
}
