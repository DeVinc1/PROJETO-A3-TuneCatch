import React from 'react';
import { useParams } from 'react-router-dom';

function SearchByPlaylistNamePage() {
  const { playlistNameQuery } = useParams();
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">Pesquisa por Nome de Playlist</h1>
        <p className="mt-2 text-gray-700">Resultados para a playlist: <span className="font-bold">{playlistNameQuery || 'Nenhuma playlist especificada'}</span></p>
      </div>
    </div>
  );
}

export default SearchByPlaylistNamePage;