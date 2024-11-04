export async function registerTasteyServiceWorker() {
    if("serviceWorker" in navigator){
        await navigator.serviceWorker.register('Tastey_service_worker.js')
        .catch(function(error) {
            console.log('Registration failed with ' + error);
        })
    } else {
        console.error("Service workers are not supported.")
    }
}

export function notificationQuery(title, options) {
    options.icon = "../assets/tastey-meal-icons/tastey-icon.jpeg"
    options.badge = "../assets/tastey-meal-icons/tastey-icon.png"
    options.actions = [
        {
            action: "open-reservation",
            title: "Make a Reservation",
            type: "button",
            icon: "../assets/tastey-meal-icons/reservation-icon.png"
        },
        {
            action: "open-menu",
            title: "Open Tastey Menu",
            type: "button",
            icon: "../assets/tastey-meal-icons/menu-icon.svg"
        }
    ]
    if (Notification?.permission === "granted") {
        registerTasteyServiceWorker()
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options)
        })
    } else if (Notification && Notification.permission !== "denied") {
        Notification.requestPermission().then(status => {
            if (status === "granted") {
                registerTasteyServiceWorker()
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(title, options)
                })
            } else {
                alert("You have to give notifiction permission to get the Tastey Check Out Notification")
            }
        })
    } else {
        alert("You have to give notifiction permission to get the Tastey Check Out Notification")
    }
}