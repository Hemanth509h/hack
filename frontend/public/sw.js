/* eslint-disable no-restricted-globals */
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'The Quad';
  const options = {
    body: data.message || 'New notification',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: data.dataPayload || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.ctaUrl || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
