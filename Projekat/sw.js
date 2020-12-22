//moze da bude prazna funkcija za instaliranje
'use strict';
self.addEventListener(
    'install', function (event) {
        event.waitUntil(
            self.skipWaiting()
        );
    }
);
self.addEventListener('fetch', () => {});

self.addEventListener('push', function (event) {
    console.log('Received push');
    var notificationTitle = 'Hello';
    var notificationOptions = {
        body: 'Thanks for sending this push msg.',
        icon: 'icon',
        badge: 'badge',
        tag: 'simple-push-demo-notification',
        data: {
            url: 'https://developers.google.com/web/fundamentals/getting-started/push-notifications/'
        }
    };
//iscitavamo podatke dobijene iz push servisa
    if (event.data) {
        var dataText = event.data.text();

        const obj = dataText? JSON.parse(dataText) : ''
        notificationTitle = 'Received Payload';
        notificationOptions.body = `Push data: ${obj.data || 'no-data'}`;
    }

    //pokazuje se notifikacija koju smo dobili iz push servisa.
    event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)]));
});

//kada se pritisne notifikacija
self.addEventListener('notificationclick', function (event) {
    //zatvori je
    event.notification.close();
    //i odvedi tu gde treba(vodi nas gore na link url!)
    if (event.notification.data && event.notification.data.url) {
        clients.openWindow(event.notification.data.url);
    }
});