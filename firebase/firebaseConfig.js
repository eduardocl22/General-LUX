// /firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCEbOGw7gtGmyiXQ3vz6pwZvJpJNOHm-ck",
  authDomain: "general-lux-app-01.firebaseapp.com",
  projectId: "general-lux-app-01",
  storageBucket: "general-lux-app-01.appspot.com", // corregido
  messagingSenderId: "3380380007",
  appId: "1:3380380007:web:0a0c19e6dbcc31e5332fc2",
  measurementId: "G-39W2ML0XEM",
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
