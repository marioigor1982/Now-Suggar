import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BloodSugarRecord } from '../types';
import { ChartIcon } from './icons/Icons';

interface BloodSugarChartProps {
  data: BloodSugarRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-gray-800">{`${label}`}</p>
        <p className="text-indigo-600">{`Nível: ${payload[0].value} mg/dL`}</p>
      </div>
    );
  }
  return null;
};

const BloodSugarChart: React.FC<BloodSugarChartProps> = ({ data }) => {
  const formattedData = data
    .map(record => ({
      ...record,
      // Format date for display on the X-axis
      name: new Date(record.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    }))
    // Sort by timestamp to ensure the line connects points chronologically
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full h-96">
      {data.length > 0 ? (
         <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={['dataMin - 20', 'dataMax + 20']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={180} label={{ value: 'Alto', position: 'insideTopRight', fill: '#ef4444' }} stroke="#ef4444" strokeDasharray="3 3" />
            <ReferenceLine y={140} label={{ value: 'Pós-refeição', position: 'insideTopRight', fill: '#f97316' }} stroke="#f97316" strokeDasharray="3 3" />
            <ReferenceLine y={70} label={{ value: 'Baixo', position: 'insideTopRight', fill: '#3b82f6' }} stroke="#3b82f6" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="level" name="Nível de Glicose" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 8 }} />
          </LineChart>
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