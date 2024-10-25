"use client"
import notification_hub from "@/constants/notification_hub"
import { useEffect, useState } from "react"

import { useAuth } from '@/hooks/query'
import { buildApiURL } from "@/utils/helper/request"
import { Axios } from "@/libs/axios"
import { API } from "@/constants"

const ServiceWorker = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Access localStorage only in the browser (client-side)
        const data = localStorage.getItem('user');
        setUserData(JSON.parse(data)); // Parse the data if it's in JSON format
    }, []); //
    const vapidPublicKey = notification_hub.VAPID_Public_Key

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }
    
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registerServiceWorker = async () => {
            try {
            const registration = await navigator.serviceWorker.register('/sw.js')
            
            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            })
            
            const subscriptionData = {
                endpoint: subscription.endpoint,
                p256dh: btoa(
                String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))
                ),
                auth: btoa(
                String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))
                ),
            }

            // Send subscription to the server
            await Axios.put(
                buildApiURL(API.NOTIFICATION, { entra_id: userData.entra_id }),
                JSON.stringify(subscriptionData),
                {
                headers: {
                    'Content-Type': 'application/json',
                },
                }
            )
            } catch (error) {
            console.error('Service Worker registration or subscription error:', error)
            }
        }

        registerServiceWorker()
        }
    }, [userData]) // Ensure the effect runs only once on mount
    return null
}

export default ServiceWorker