// /firebase/firebase.js
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { app } from "./firebaseConfig";

// Exportar Firestore y Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Exportar Auth
export const auth = getAuth(app);

// Proveedor de Google (necesario para login con Google)
export const googleProvider = new GoogleAuthProvider();
