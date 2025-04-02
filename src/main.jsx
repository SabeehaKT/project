import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then((registration) => {
    console.log("Service Worker registered:", registration);
  });
}

// Request notification permission early
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Notification permission granted');
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
  </StrictMode>,
)
