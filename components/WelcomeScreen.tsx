import React from 'react';
import { BloodTestIcon } from './icons/Icons';

interface WelcomeScreenProps {
  onNavigateToDashboard: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigateToDashboard }) => {
  return (
    <div 
      className="min-h-screen w-full bg-slate-50 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="text-center bg-white/50 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl mx-auto">
          <BloodTestIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold [text-shadow:1px_1px_2px_rgba(0,0,0,0.1)] mb-2">
            <span className="text-red-600">NO</span><span className="text-blue-600">W SUGGAR</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
            Monitore seus níveis de açúcar no sangue, visualize tendências e gerencie o diabetes de forma eficaz.
          </p>
          <button
            onClick={onNavigateToDashboard}
            className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
          >
            Aferir Glicemia
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;