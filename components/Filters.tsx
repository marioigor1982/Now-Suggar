import React, { useState } from 'react';

export type DateFilter = 'all' | 'today' | '7days' | '30days';
export type LevelFilter = 'all' | 'low' | 'normal' | 'high';

export interface FiltersState {
  date: DateFilter;
  level: LevelFilter;
}

interface FiltersProps {
  onFilterChange: (filters: FiltersState) => void;
}

const FilterButton = ({ label, value, activeValue, onClick }: { label: string, value: string, activeValue: string, onClick: (value: any) => void}) => (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
        activeValue === value
          ? 'bg-indigo-600 text-white shadow'
          : 'bg-white/80 hover:bg-indigo-100 text-gray-700'
      }`}
    >
      {label}
    </button>
);

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');

  const handleDateChange = (filter: DateFilter) => {
    setDateFilter(filter);
    onFilterChange({ date: filter, level: levelFilter });
  };

  const handleLevelChange = (filter: LevelFilter) => {
    setLevelFilter(filter);
    onFilterChange({ date: dateFilter, level: filter });
  };
  
  return (
    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">Filtrar por Período</h4>
                <div className="flex flex-wrap gap-2">
                    <FilterButton label="Todos" value="all" activeValue={dateFilter} onClick={handleDateChange} />
                    <FilterButton label="Hoje" value="today" activeValue={dateFilter} onClick={handleDateChange} />
                    <FilterButton label="Últimos 7 dias" value="7days" activeValue={dateFilter} onClick={handleDateChange} />
                    <FilterButton label="Últimos 30 dias" value="30days" activeValue={dateFilter} onClick={handleDateChange} />
                </div>
            </div>
             <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">Filtrar por Nível (mg/dL)</h4>
                <div className="flex flex-wrap gap-2">
                    <FilterButton label="Todos" value="all" activeValue={levelFilter} onClick={handleLevelChange} />
                    <FilterButton label="Baixo (<70)" value="low" activeValue={levelFilter} onClick={handleLevelChange} />
                    <FilterButton label="Normal (70-180)" value="normal" activeValue={levelFilter} onClick={handleLevelChange} />
                    <FilterButton label="Alto (>180)" value="high" activeValue={levelFilter} onClick={handleLevelChange} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Filters;