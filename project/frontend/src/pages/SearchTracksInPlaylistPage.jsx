import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

function SearchTracksInPlaylistPage() {
  const { playlistId } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">Pesquisa de Músicas em Playlist</h1>
        <p className="mt-2 text-gray-700">Buscando na playlist ID: <span className="font-bold">{playlistId}</span></p>
        <p className="mt-2 text-gray-700">Termo de busca: <span className="font-bold">{query || 'Nenhum termo especificado'}</span></p>
      </div>
    </div>
  );
}

export default SearchTracksInPlaylistPage;