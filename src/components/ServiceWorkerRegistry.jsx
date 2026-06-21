'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegistry() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        function(registration) {
          console.log('Service Worker registration successful with scope: ', registration.scope);
        },
        function(err) {
          console.log('Service Worker registration failed: ', err);
        }
      );
      
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'PUSH_RECEIVED') {
          // Dynamically import toast so it doesn't break SSR
          import('react-hot-toast').then(({ default: toast }) => {
            toast(event.data.title + ' \n' + event.data.body, { duration: 6000 });
          });
        }
      });
    }
  }, []);

  return null;
}
