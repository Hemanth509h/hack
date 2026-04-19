import { useEffect } from 'react';

export const useNotifications = () => {
  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted');
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('SW registered:', registration);
        },
        (error) => {
          console.log('SW registration failed:', error);
        }
      );
    }
  }, []);

  return { requestPermission };
};
