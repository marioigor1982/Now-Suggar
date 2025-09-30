import React, { useState } from 'react';
import { BloodSugarRecord } from '../types';
import { TrashIcon, PencilIcon, SaveIcon } from './icons/Icons';

interface RecordsTableProps {
  records: BloodSugarRecord[];
  onDelete: (id: string) => void;
  onUpdate: (record: BloodSugarRecord) => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<BloodSugarRecord>>({});

  const handleEditClick = (record: BloodSugarRecord) => {
    setEditingId(record.id);
    setEditFormData({ ...record });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleSaveClick = () => {
    if (editingId && editFormData.date && editFormData.time && editFormData.level) {
      const timestamp = new Date(`${editFormData.date}T${editFormData.time}`).getTime();
      onUpdate({
        id: editingId,
        date: editFormData.date,
        time: editFormData.time,
        level: Number(editFormData.level),
        timestamp,
      });
      setEditingId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDeleteClick = (id: string) => {
      if (window.confirm('Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita.')) {
          onDelete(id);
      }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Medições</h3>
      <div className="max-h-96 overflow-y-auto">
        {records.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 sticky top-0 backdrop-blur-sm">
              <tr>
                <th scope="col" className="px-4 py-3">Data</th>
                <th scope="col" className="px-4 py-3">Hora</th>
                <th scope="col" className="px-4 py-3">Nível (mg/dL)</th>
                <th scope="col" className="px-2 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-200/50 hover:bg-gray-50/50">
                  {editingId === record.id ? (
                    <>
                      <td className="px-2 py-1">
                        <input type="date" name="date" value={editFormData.date} onChange={handleChange} className="w-full bg-transparent border-b border-indigo-300 focus:outline-none"/>
                      </td>
                      <td className="px-2 py-1">
                        <input type="time" name="time" value={editFormData.time} onChange={handleChange} className="w-full bg-transparent border-b border-indigo-300 focus:outline-none"/>
                      </td>
                      <td className="px-2 py-1">
                        <input type="number" name="level" value={editFormData.level} onChange={handleChange} className="w-20 bg-transparent border-b border-indigo-300 focus:outline-none"/>
                      </td>
                      <td className="px-2 py-2 text-center flex items-center justify-center gap-2">
                        <button onClick={handleSaveClick} className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100" aria-label="Salvar">
                          <SaveIcon className="w-5 h-5" />
                        </button>
                        <button onClick={handleCancelClick} className="text-gray-500 hover:text-gray-700 p-1" aria-label="Cancelar">
                           <span className="text-xl font-bold">&times;</span>
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{new Date(record.timestamp).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-2">{record.time}</td>
                      <td className="px-4 py-2 font-medium">{record.level}</td>
                      <td className="px-2 py-2 text-center flex items-center justify-center gap-2">
                         <button onClick={() => handleEditClick(record)} className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-100 transition-colors" aria-label="Editar registro">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(record.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors" aria-label={`Excluir registro de ${record.level} mg/dL`}>
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-8">Nenhum registro encontrado para os filtros selecionados.</p>
        )}
      </div>
    </div>
  );
};

export default RecordsTable;