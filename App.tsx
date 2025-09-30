import React, { useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import useLocalStorage from './hooks/useLocalStorage';
import { BloodSugarRecord, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';

// Componente para a aplicação quando o usuário está autenticado
const AuthenticatedApp: React.FC<{ user: FirebaseUser }> = ({ user }) => {
  const [view, setView] = useState<'welcome' | 'dashboard'>('welcome');
  
  // Cria chaves únicas para o localStorage de cada usuário
  const userProfileKey = `bsr-profile-${user.uid}`;
  const userRecordsKey = `bsr-records-${user.uid}`;

  const [records, setRecords] = useLocalStorage<BloodSugarRecord[]>(userRecordsKey, []);
  
  const [profile, setProfile] = useLocalStorage<UserProfile>(userProfileKey, {
    name: user.displayName || 'Usuário',
    dob: '',
    weight: '',
    height: '',
    photo: user.photoURL || '',
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sincroniza informações do perfil do Google com o perfil local
  useEffect(() => {
    if (user && (!profile.name || profile.name === 'Usuário' || !profile.photo)) {
      setProfile(prevProfile => ({
        ...prevProfile,
        name: user.displayName || prevProfile.name || 'Usuário',
        photo: user.photoURL || prevProfile.photo || '',
      }));
    }
  }, [user, profile.name, profile.photo, setProfile]);

  const handleAddRecord = (newRecord: Omit<BloodSugarRecord, 'id' | 'timestamp'>) => {
    const timestamp = new Date(`${newRecord.date}T${newRecord.time}`).getTime();
    const recordToAdd: BloodSugarRecord = {
      ...newRecord,
      timestamp,
      id: `rec-${timestamp}-${Math.random()}`,
    };

    const updatedRecords = [...records, recordToAdd].sort((a, b) => b.timestamp - a.timestamp);
    setRecords(updatedRecords);
  };

  const handleUpdateRecord = (updatedRecord: BloodSugarRecord) => {
    const updatedRecords = records.map(record =>
      record.id === updatedRecord.id ? updatedRecord : record
    );
    setRecords(updatedRecords.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const saveUserProfile = async () => {
    setIsSavingProfile(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSavingProfile(false);
  };

  const navigateToDashboard = () => setView('dashboard');
  const navigateToWelcome = () => setView('welcome');

  if (view === 'welcome') {
    return <WelcomeScreen onNavigateToDashboard={navigateToDashboard} />;
  }

  return (
    <Dashboard
      records={records}
      addRecord={handleAddRecord}
      updateRecord={handleUpdateRecord}
      deleteRecord={handleDeleteRecord}
      userProfile={profile}
      setUserProfile={setProfile}
      saveUserProfile={saveUserProfile}
      isSavingProfile={isSavingProfile}
      onNavigateToWelcome={navigateToWelcome}
    />
  );
};

// Componente principal que gerencia o fluxo de autenticação
const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Limpa a inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-xl font-semibold text-gray-700">Carregando...</div>
        </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }
  
  return <AuthenticatedApp user={user} />;
};

export default App;
