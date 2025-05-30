self.addEventListener('install', skipWaiting)

self.addEventListener('notificationclick', e => {
    const url = page => {return new URL(page, self.location.origin).href}
    let sitePageUrl
    switch(e.action) {
        case 'open-reservation': 
            sitePageUrl = url('RESTAURANT_THEMED_SITE/reservation.html')
            break
        case 'open-menu':
            sitePageUrl = url('RESTAURANT_THEMED_SITE/menu.html')
            break
        default:
            sitePageUrl = url('RESTAURANT_THEMED_SITE/index.html')
    }
    
    const promiseChain = clients
    .matchAll({
        type: 'window',
        includeUncontrolled: true
    })
    .then((windowClients) => {
        let matchingClient = null

        for (let i = 0; i < windowClients.length; i ++) {
            const windowClient = windowClients[i]
            if (String(windowClient.url) == sitePageUrl) {
                matchingClient = windowClient
                break
            }
        }

        if (matchingClient !== null) 
            return matchingClient.focus()
        else 
            return clients.openWindow(sitePageUrl)
    })

    e.waitUntil(promiseChain)
})