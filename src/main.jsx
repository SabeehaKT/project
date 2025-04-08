import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyAFD2wA3wjB2_GjyX7DKr6RfCjamUluU_k",
//   authDomain: "mindpal-69a6c.firebaseapp.com",
//   projectId: "mindpal-69a6c",
//   messagingSenderId: "79547276806",
//   appId: "1:79547276806:web:aa4156f247208675d56d87",
// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// export async function requestAndSaveNotificationPermission(userId) {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === "granted") {
//       const token = await getToken(messaging, { vapidKey: "BOVI0ckOXANhniodx1rjpkXDpcpS4rNNHBIGFJuEnY-A_5hSsv9lpdakenOxAET_NTU5-AmFkvDwcwrqjv0asW0" });
//       console.log("FCM Token:", token);
      
//       // Send token to your server
//       await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/saveNotificationToken`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ userId, token })
//       });
      
//       return true;
//     } else {
//       console.error("Permission not granted for notifications.");
//       return false;
//     }
//   } catch (error) {
//     console.error("Error setting up notifications:", error);
//     return false;
//   }
// }

// // Keep the onMessage handler
// onMessage(messaging, (payload) => {
//   console.log("Message received: ", payload);
//   // Display the notification using the native notification API
//   const { title, body } = payload.notification;
//   new Notification(title, { body });
// });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
  </StrictMode>,
)
