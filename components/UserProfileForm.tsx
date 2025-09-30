import React, { useRef } from 'react';
import { UserProfile } from '../types';
import { SaveIcon, UserIcon, PencilIcon } from './icons/Icons';

interface UserProfileProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onSave: () => void;
  isSaving: boolean;
}

const UserProfileForm: React.FC<UserProfileProps> = ({ profile, onProfileChange, onSave, isSaving }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onProfileChange({ ...profile, [name]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          onProfileChange({ ...profile, photo: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Perfil do Usuário</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer" onClick={triggerFileSelect} >
            {profile.photo ? (
              <img src={profile.photo} alt="Foto de Perfil" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-gray-500" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 ring-2 ring-white">
                <PencilIcon className="w-4 h-4" />
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" aria-label="Alterar foto de perfil" />
          </div>
          <div className="flex-grow">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} placeholder="Seu nome completo" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Data de Nasc.</label>
            <input type="date" name="dob" id="dob" value={profile.dob} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Peso (kg)</label>
            <input type="number" name="weight" id="weight" value={profile.weight} onChange={handleChange} placeholder="Ex: 75" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">Altura (cm)</label>
            <input type="number" name="height" id="height" value={profile.height} onChange={handleChange} placeholder="Ex: 170" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:bg-green-400">
          <SaveIcon className="w-5 h-5 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
};
export default UserProfileForm;
