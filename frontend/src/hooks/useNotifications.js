import { useEffect } from 'react';
import { useUpdatePreferencesMutation } from '../services/notificationApi';

export const useNotifications = () => {


  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // In a real implementation with WebPushr, we would register the device here
      console.log('Notification permission granted');
      // updatePrefs({ pushEnabled: true });
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
