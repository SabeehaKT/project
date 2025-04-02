self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification("Habit Reminder", {
    body: data.title,
    icon: "/reminder-icon.png",
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/habitlist"));
});