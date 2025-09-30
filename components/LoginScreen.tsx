import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { BloodTestIcon, GoogleIcon } from './icons/Icons';

const LoginScreen: React.FC = () => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      alert("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-slate-50 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&id=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="text-center bg-white/50 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl max-w-md mx-auto">
          <BloodTestIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold [text-shadow:1px_1px_2px_rgba(0,0,0,0.1)] mb-2">
            <span className="text-red-600">NO</span><span className="text-blue-600">W SUGGAR</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
            Acesse para monitorar seus níveis de açúcar no sangue de forma eficaz.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 font-medium text-lg rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Entrar com sua conta Google"
          >
            <GoogleIcon className="w-6 h-6" />
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;