const CACHE_NAME = 'habit-tracker-v1';

// Cache resources on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/js/main.chunk.js',
        '/reminder-icon.png',
        // Add other resources you want to cache
      ]);
    })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Check and display reminders
const checkReminders = async () => {
  try {
    const db = await openReminderDatabase();
    const reminders = await getAllReminders(db);
    
    const now = new Date();
    const currentDay = now.toLocaleString('en-us', {weekday:'long'});
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    reminders.forEach(reminder => {
      if (!reminder.enabled) return;
      
      // Check if this reminder should run today based on frequency
      let shouldRun = false;
      
      if (reminder.frequency === 'daily') {
        shouldRun = true;
      } else if (reminder.frequency === 'weekly' || reminder.frequency === 'custom') {
        shouldRun = reminder.days.includes(currentDay);
      }
      
      if (shouldRun && reminder.time === currentTime) {
        showNotification(reminder.title);
      }
    });
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

// Show notification
const showNotification = async (title) => {
  const registration = await self.registration;
  
  registration.showNotification('Habit Reminder', {
    body: `Time for ${title}!`,
    icon: '/reminder-icon.png',
    badge: '/badge-icon.png',
    vibrate: [200, 100, 200],
    data: {
      habitTitle: title,
      timestamp: new Date().getTime()
    },
    actions: [
      {
        action: 'complete',
        title: 'Mark Complete'
      },
      {
        action: 'snooze',
        title: 'Snooze'
      }
    ]
  });
};

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'complete') {
    // Mark the habit as complete
    markHabitComplete(event.notification.data.habitTitle);
  } else if (event.action === 'snooze') {
    // Snooze the reminder for 15 minutes
    snoozeReminder(event.notification.data.habitTitle, 15);
  } else {
    // Open the app when the notification is clicked
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(windowClients => {
        // Check if there is already a window open
        for (let client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Mark a habit as complete
const markHabitComplete = async (title) => {
  try {
    // Get the user's token for authorization
    const token = await getAuthToken();
    
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    const response = await fetch('http://localhost:3000/api/auth/completeHabit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark habit as complete');
    }
    
    console.log('Habit marked as complete:', title);
  } catch (error) {
    console.error('Error marking habit as complete:', error);
  }
};

// Snooze a reminder
const snoozeReminder = (title, minutes) => {
  setTimeout(() => {
    showNotification(title);
  }, minutes * 60 * 1000);
};

// Get authentication token from IndexedDB
const getAuthToken = async () => {
  try {
    const db = await openDatabase('auth-db', 1, 'auth', 'token');
    const transaction = db.transaction(['auth'], 'readonly');
    const store = transaction.objectStore('auth');
    const request = store.get('token');
    
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        if (event.target.result) {
          resolve(event.target.result.value);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Open the reminder database
const openReminderDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('reminders-db', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('reminders')) {
        db.createObjectStore('reminders', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Open any database
const openDatabase = (name, version, storeName, keyPath) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Get all reminders from the database
const getAllReminders = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['reminders'], 'readonly');
    const store = transaction.objectStore('reminders');
    const request = store.getAll();
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Periodic sync for checking reminders (Chrome and Edge only)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'reminder-sync') {
    event.waitUntil(checkReminders());
  }
});

// Set up a regular interval to check for reminders every minute
// This is a fallback for browsers that don't support Periodic Background Sync
setInterval(checkReminders, 60000);

// Initial check on service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(checkReminders());
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to store in cache
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(event.request);
      })
  );
});