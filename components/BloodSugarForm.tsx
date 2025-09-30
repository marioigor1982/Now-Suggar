
import React, { useState } from 'react';
import { BloodSugarRecord } from '../types';
import { PlusIcon } from './icons/Icons';

interface BloodSugarFormProps {
  onAddRecord: (record: Omit<BloodSugarRecord, 'id' | 'timestamp'>) => void;
}

const BloodSugarForm: React.FC<BloodSugarFormProps> = ({ onAddRecord }) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [level, setLevel] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(currentTime);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericLevel = parseInt(level, 10);
    if (!numericLevel || numericLevel <= 0) {
      setError('Por favor, insira um valor de glicose válido.');
      return;
    }
    setError('');
    onAddRecord({ date, time, level: numericLevel });
    setLevel('');
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Nova Medição</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="glucose-level" className="block text-sm font-medium text-gray-700">
            Nível de Glicose (mg/dL)
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="glucose-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Ex: 95"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={today}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora</label>
                <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Registro
        </button>
      </form>
    </div>
  );
};

export default BloodSugarForm;
