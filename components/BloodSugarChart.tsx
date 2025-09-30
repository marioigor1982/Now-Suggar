import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BloodSugarRecord } from '../types';
import { ChartIcon } from './icons/Icons';

interface BloodSugarChartProps {
  data: BloodSugarRecord[];
}

const getColor = (level: number) => {
    if (level < 90) return '#22c55e'; // Verde
    if (level <= 130) return '#f59e0b'; // Amarelo
    return '#ef4444'; // Vermelho
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const level = payload[0].value;
    const color = getColor(level);
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-gray-800">{`${label}`}</p>
        <p style={{ color }}>{`Nível: ${level} mg/dL`}</p>
      </div>
    );
  }
  return null;
};

const BloodSugarChart: React.FC<BloodSugarChartProps> = ({ data }) => {
  const formattedData = data
    .map(record => ({
      ...record,
      name: new Date(record.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full h-96">
      {data.length > 0 ? (
         <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={['dataMin - 20', 'dataMax + 20']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span className="text-gray-700">{value}</span>} />
            <Bar dataKey="level" name="Nível de Glicose">
                {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.level)} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChartIcon className="w-16 h-16 mb-4"/>
            <h3 className="text-xl font-semibold">Sem dados para exibir</h3>
            <p>Adicione sua primeira medição para ver o gráfico.</p>
        </div>
      )}
    </div>
  );
};

export default BloodSugarChart;