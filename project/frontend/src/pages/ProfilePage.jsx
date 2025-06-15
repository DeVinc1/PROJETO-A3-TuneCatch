import React from 'react';

function ProfilePage() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">Página de Perfil (Meu Perfil)</h1>
        <p className="mt-2 text-gray-700">Detalhes do seu perfil pessoal.</p>
      </div>
    </div>
  );
}

export default ProfilePage;