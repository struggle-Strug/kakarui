import notification_hub from "@/constants/notification_hub";

const vapidPublicKey = notification_hub.VAPID_Public_Key;

navigator.serviceWorker.register('/serviceWorker.js')

    .then(function(registration) {

        return registration.pushManager.getSubscription()

            .then(async function(subscription) {

                if (subscription) {

                    return subscription;

                }

                const response = await fetch('/api/notifications/publicKey');

                const vapidPublicKey = await response.text();

                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                return registration.pushManager.subscribe({

                    userVisibleOnly: true,

                    applicationServerKey: convertedVapidKey

                });

            });

    }).then(function(subscription) {

        fetch('/api/notifications/register', {

            method: 'POST',

            body: JSON.stringify({

                endpoint: subscription.endpoint,

                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),

                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))

            }),

            headers: {

                'Content-Type': 'application/json'

            }

        });

    });

function urlBase64ToUint8Array(base64String) {

    const padding = '='.repeat((4 - base64String.length % 4) % 4);

    const base64 = (base64String + padding)

        .replace(/-/g, '+')

        .replace(/_/g, '/');

    const rawData = window.atob(base64);

    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {

        outputArray[i] = rawData.charCodeAt(i);

    }

    return outputArray;

}