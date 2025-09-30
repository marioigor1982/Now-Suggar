import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbVmxm_pNV08rgNakuBMXuHsL3S6qUru8",
  authDomain: "suggar-now.firebaseapp.com",
  projectId: "suggar-now",
  storageBucket: "suggar-now.firebasestorage.app",
  messagingSenderId: "706251390323",
  appId: "1:706251390323:web:12b0a3cc97b51cba1c1906",
  measurementId: "G-MEYNYWZJ7S"
};


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta instâncias de serviços do Firebase
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();