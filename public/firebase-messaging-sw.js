importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyAFD2wA3wjB2_GjyX7DKr6RfCjamUluU_k",
    authDomain: "mindpal-69a6c.firebaseapp.com",
    projectId: "mindpal-69a6c",
    storageBucket: "mindpal-69a6c.firebasestorage.app",
    messagingSenderId: "79547276806",
    appId: "1:79547276806:web:aa4156f247208675d56d87",
    measurementId: "G-LKT5WFSHY9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png",
    });
});
