import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import { API, APP_NAME, Routes } from '@/constants'

import { Progressbar } from '@/components/layout/common'
import notification_hub from "@/constants/notification_hub";

import AppProviders from '@/contexts'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

import '@/styles/index.css'
import { Axios } from '@/libs/axios'
import { buildApiURL } from '@/utils/helper/request'
import { SessionProvider } from 'next-auth/react'

export default function MyApp({ Component, pageProps }) {
  const { session, ...restPageProps } = pageProps
  
  const router = useRouter()
  
  const isAuthPage = router.pathname === Routes.AUTH.LOGIN
  
  const isPublicPage = router.pathname === Routes.CHECK

  const idLowCodeEditorPage = router.pathname === Routes.LOW_CODE_EDITOR
  const layout = useCallback(
    (children) => {
      if (isPublicPage || idLowCodeEditorPage) {
        return children
      }
      
      if (isAuthPage) {
        return <AuthLayout>{children}</AuthLayout>
      }
      
      return <DashboardLayout>{children}</DashboardLayout>
    },
    [isAuthPage, isPublicPage, router.pathname]
  )

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  
  
  useEffect(() => {
    const vapidPublicKey = notification_hub.VAPID_Public_Key
    //user entra ID
    const user = localStorage.user
    const entraId = user?.entraId
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          
          // Subscribe to push notifications
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });
          
          
          const subscriptionData = {
            endpoint: subscription.endpoint,
            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
          };

          // Send subscription to the server
          const response = await Axios.put(
            buildApiURL(API.NOTIFICATION, { entra_id: entraId }),
            JSON.stringify(subscriptionData),
            {
              headers: {
                  'Content-Type': 'application/json',
              },
            }
          )

          const data = await response.json();
          console.log('Subscription response from server:', data);
        } catch (error) {
          console.error('Service Worker registration or subscription error:', error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <SessionProvider session={session}>
        <AppProviders locale={router.locale || 'ja'} pageProps={restPageProps}>
          <Progressbar />
          {layout(<Component {...restPageProps} />)}
        </AppProviders>
      </SessionProvider>
    </>
  )
}
