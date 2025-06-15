import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Importe o hook de autenticação

function HomePage() {
  const { userLoggedId, isAuthenticated, logout } = useAuth(); // Acessa o estado de autenticação

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Página Inicial</h1>
      <p className="mt-2 text-gray-700 mb-4">Bem-vindo ao TuneCatch!</p>
      {isAuthenticated ? (
        <div className="text-center">
          <p className="text-lg text-green-600">Você está logado como usuário ID: <span className="font-bold">{userLoggedId}</span></p>
          <button
            onClick={logout}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-lg text-red-600">Você não está logado.</p>
      )}
    </div>
  );
}

export default HomePage;