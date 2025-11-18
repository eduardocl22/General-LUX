// firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig";

// -------------------------------
// 🔥 Inicializar Firebase
// -------------------------------
const app = initializeApp(firebaseConfig);

// -------------------------------
// 🔥 Autenticación con persistencia REAL
// -------------------------------
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// -------------------------------
// 🔥 Base de datos
// -------------------------------
const db = getFirestore(app);

// -------------------------------
// ✨ Métodos de autenticación
// -------------------------------

// Iniciar sesión
const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Registro
const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Restablecer contraseña
const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Cerrar sesión
const logout = () => {
  return signOut(auth);
};

// Escuchar cambios de usuario
const listenAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// -------------------------------
// Exportar
// -------------------------------
export {
  auth,
  db,
  loginWithEmail,
  registerWithEmail,
  resetPassword,
  logout,
  listenAuthChanges,
};
