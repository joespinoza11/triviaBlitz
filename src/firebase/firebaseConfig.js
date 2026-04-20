import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Función para validar credenciales
export const authenticateUser = (username, accessCode) => {
  const correctAccessCode = import.meta.env.VITE_ACCESS_CODE;

  if (!username || username.trim() === "") {
    throw new Error("El nombre de usuario es requerido");
  }

  if (accessCode !== correctAccessCode) {
    throw new Error("Código de acceso inválido");
  }

  return {
    username,
    authenticated: true,
    timestamp: new Date(),
  };
};

export default app;
