// ----------------------------------------------------------------------
// Background Web Push Notification Service Worker
// Handles background alarm triggers and lock screen interactions.
// ----------------------------------------------------------------------

self.addEventListener('push', function(event) {
  let data = { 
    title: '💊 Time for your Medicine!', 
    body: 'Please take your scheduled dosage.',
    dosage: '1 Dose',
    notes: '' 
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { 
        title: '💊 Time for your Medicine!', 
        body: event.data.text(),
        dosage: '1 Dose',
        notes: ''
      };
    }
  }

  const options = {
    body: `${data.body}${data.dosage ? `\nDosage: ${data.dosage}` : ''}${data.notes ? `\nInstructions: ${data.notes}` : ''}`,
    icon: 'https://cdn-icons-png.flaticon.com/512/822/822143.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/822/822143.png',
    vibrate: [300, 100, 300, 100, 400],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'pharma-alarm'
    },
    actions: [
      { 
        action: 'taken', 
        title: 'Taken 💊', 
        icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' 
      },
      { 
        action: 'close', 
        title: 'Snooze 🔔', 
        icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' 
      }
    ],
    tag: 'pill-reminder-alert',
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle lock screen action button clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'taken') {
    // Perform background logging or let the app know the dose was logged
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url.indexOf('/profile') !== -1 && 'focus' in client) {
            client.postMessage({ type: 'DOSE_TAKEN_SW', medName: event.notification.title });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/profile?logged=true');
        }
      })
    );
  }
});
