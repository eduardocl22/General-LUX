// /firebase/firebase.js
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { app } from "./firebaseConfig";

// Exportar Firestore y Storage (para más adelante)
export const db = getFirestore(app);
export const storage = getStorage(app);
