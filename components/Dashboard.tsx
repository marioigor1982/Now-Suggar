import React, { useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { BloodSugarRecord, UserProfile } from '../types';
import BloodSugarChart from './BloodSugarChart';
import BloodSugarForm from './BloodSugarForm';
import UserProfileForm from './UserProfileForm';
import StatCard from './StatCard';
import GlucoseGauge from './GlucoseGauge';
import { ArrowUpIcon, ArrowDownIcon, ActivityIcon, BloodTestIcon, FileDownloadIcon, UserIcon, LeftArrowIcon, LogoutIcon } from './icons/Icons';
import Filters, { FiltersState } from './Filters';
import RecordsTable from './RecordsTable';


interface DashboardProps {
  records: BloodSugarRecord[];
  addRecord: (record: Omit<BloodSugarRecord, 'id' | 'timestamp'>) => void;
  updateRecord: (record: BloodSugarRecord) => void;
  deleteRecord: (id: string) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  saveUserProfile: () => Promise<void>;
  isSavingProfile: boolean;
  onNavigateToWelcome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, addRecord, updateRecord, deleteRecord, userProfile, setUserProfile, saveUserProfile, isSavingProfile, onNavigateToWelcome }) => {
    const [filters, setFilters] = useState<FiltersState>({ date: 'all', level: 'all' });
    const [isExporting, setIsExporting] = useState(false);

    const filteredRecords = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
        const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29).getTime();

        return records.filter(record => {
          const recordDate = record.timestamp;
          let dateMatch = true;
          if (filters.date === 'today') dateMatch = recordDate >= todayStart;
          else if (filters.date === '7days') dateMatch = recordDate >= sevenDaysAgo;
          else if (filters.date === '30days') dateMatch = recordDate >= thirtyDaysAgo;
          if (!dateMatch) return false;

          const level = record.level;
          let levelMatch = true;
          if (filters.level === 'low') levelMatch = level < 70;
          else if (filters.level === 'normal') levelMatch = level >= 70 && level <= 180;
          else if (filters.level === 'high') levelMatch = level > 180;
          if (!levelMatch) return false;
          
          return true;
        });
      }, [records, filters]);

    const stats = useMemo(() => {
        if (filteredRecords.length === 0) return { min: 0, max: 0, avg: 0 };
        const levels = filteredRecords.map(r => r.level);
        const min = Math.min(...levels);
        const max = Math.max(...levels);
        const avg = Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length);
        return { min, max, avg };
    }, [filteredRecords]);

    const latestRecord = useMemo(() => {
        if (filteredRecords.length === 0) return null;
        // Encontra o registro com o maior timestamp (o mais recente)
        return filteredRecords.reduce((latest, current) => 
            current.timestamp > latest.timestamp ? current : latest
        );
    }, [filteredRecords]);
    
    const handleExportPDF = () => {
        const pdfContainer = document.getElementById('pdf-export-content');
        if (!pdfContainer) return;
        
        setIsExporting(true);
        setTimeout(() => {
            html2canvas(pdfContainer, { scale: 2 }).then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const canvasWidth = canvas.width;
              const canvasHeight = canvas.height;
              const ratio = canvasWidth / canvasHeight;
              const imgHeight = (pdfWidth - 20) / ratio;

              pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, imgHeight);
              pdf.save(`relatorio-now-suggar-${new Date().toISOString().split('T')[0]}.pdf`);
              setIsExporting(false);
            });
        }, 100);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            alert("Ocorreu um erro ao tentar sair. Por favor, tente novamente.");
        }
    };

    return (
        <>
        <div 
            className="min-h-screen w-full bg-slate-50 bg-cover bg-center"
            style={{ backgroundImage: "url('https://picsum.photos/seed/wellness/1920/1080')" }}
        >
            <div className="min-h-screen w-full bg-gray-100/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
                <header className="mb-8 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                         <BloodTestIcon className="w-10 h-10 text-red-500" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold [text-shadow:1px_1px_2px_rgba(0,0,0,0.1)]">
                                <span className="text-red-600">NO</span><span className="text-blue-600">W SUGGAR</span>
                            </h1>
                            <p className="text-md text-gray-600 mt-1">Olá, {userProfile.name?.split(' ')[0] || 'Usuário'}! Visualize seus dados.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onNavigateToWelcome}
                            className="flex items-center gap-2 px-4 py-2 bg-white/80 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-colors"
                        >
                            <LeftArrowIcon className="w-5 h-5" />
                            Voltar
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                        >
                            <FileDownloadIcon className="w-5 h-5" />
                            {isExporting ? 'Exportando...' : 'Exportar PDF'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors"
                        >
                            <LogoutIcon className="w-5 h-5" />
                            Sair
                        </button>
                    </div>
                </header>

                <main className="space-y-8">
                    <section>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard title="Mínimo (Filtro)" value={`${stats.min} mg/dL`} icon={<ArrowDownIcon className="w-6 h-6 text-white"/>} colorClass="bg-blue-500" />
                            <StatCard title="Máximo (Filtro)" value={`${stats.max} mg/dL`} icon={<ArrowUpIcon className="w-6 h-6 text-white"/>} colorClass="bg-red-500" />
                            <StatCard title="Média (Filtro)" value={`${stats.avg} mg/dL`} icon={<ActivityIcon className="w-6 h-6 text-white" strokeWidth={2.5}/>} colorClass="bg-green-500" />
                        </div>
                    </section>
                    
                    <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                           <UserProfileForm profile={userProfile} onProfileChange={setUserProfile} onSave={saveUserProfile} isSaving={isSavingProfile} />
                           <BloodSugarForm onAddRecord={addRecord} />
                           <RecordsTable records={filteredRecords} onDelete={deleteRecord} onUpdate={updateRecord} />
                        </div>
                        <div className="lg:col-span-3 space-y-8">
                           <Filters onFilterChange={setFilters} />
                           <GlucoseGauge level={latestRecord?.level ?? null} lastRecordDate={latestRecord ? new Date(latestRecord.timestamp).toLocaleString('pt-BR') : null} />
                           <BloodSugarChart data={filteredRecords} />
                        </div>
                    </section>
                </main>
            </div>
        </div>

        {/* Hidden container for PDF export */}
        <div id="pdf-export-content" className="p-4 bg-white" style={{ display: isExporting ? 'block' : 'none', position: 'absolute', left: '-9999px', width: '800px' }}>
                <div className="flex items-center gap-3 p-4 border-b">
                     <BloodTestIcon className="w-10 h-10 text-red-500" />
                    <div>
                        <h1 className="text-3xl font-bold">
                            <span className="text-red-600">NO</span><span className="text-blue-600">W SUGGAR</span>
                        </h1>
                        <p className="text-md text-gray-600 mt-1">Relatório de Glicemia</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold p-4 mt-4">Gráfico de Glicemia</h2>
                <div className="w-full h-[400px] my-2">
                    <BloodSugarChart data={records} />
                </div>
                
                <div className="p-4 my-4 border rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Dados do Paciente</h2>
                    <div className="flex items-center gap-6">
                        {userProfile.photo ? (
                            <img src={userProfile.photo} alt="Foto de Perfil" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                        <div>
                            <p><strong>Nome:</strong> {userProfile.name || 'Não informado'}</p>
                            <p><strong>Data de Nascimento:</strong> {userProfile.dob ? new Date(userProfile.dob + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informado'}</p>
                            <p><strong>Peso:</strong> {userProfile.weight ? `${userProfile.weight} kg` : 'Não informado'}</p>
                            <p><strong>Altura:</strong> {userProfile.height ? `${userProfile.height} cm` : 'Não informado'}</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold p-4">Histórico de Medições</h2>
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3">Data</th>
                        <th scope="col" className="px-4 py-3">Hora</th>
                        <th scope="col" className="px-4 py-3">Nível (mg/dL)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id} className="border-b">
                          <td className="px-4 py-2">{new Date(record.timestamp).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-2">{record.time}</td>
                          <td className="px-4 py-2 font-medium">{record.level}</td>
                        </tr>
                      ))}
                    </tbody>
                </table>
        </div>
        </>
    );
};

export default Dashboard;