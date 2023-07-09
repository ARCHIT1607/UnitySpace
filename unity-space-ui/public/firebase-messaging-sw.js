importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBEeqfeEtqVSLgXu6IvGHdduhoRgKGfGCU",
    authDomain: "unityspace-52083.firebaseapp.com",
    projectId: "unityspace-52083",
    storageBucket: "unityspace-52083.appspot.com",
    messagingSenderId: "480191100100",
    appId: "1:480191100100:web:ed8b07963b2d708d3c4591",
    measurementId: "G-L0Y1L96RT1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png',
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });