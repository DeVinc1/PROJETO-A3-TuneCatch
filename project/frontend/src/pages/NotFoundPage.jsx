import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-2xl text-gray-800 mt-4">Página Não Encontrada</p>
      <p className="text-lg text-gray-600 mt-2">A página que você está procurando não existe.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}

export default NotFoundPage;