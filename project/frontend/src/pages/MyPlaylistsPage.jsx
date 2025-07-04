import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistApi } from '../services/api.js'; 
import { useAuth } from '../contexts/AuthContext.jsx'; 

function MyPlaylistsPage() {
  const { userLoggedId, isAuthenticated } = useAuth(); 
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPlaylists = async () => {
      if (!isAuthenticated || !userLoggedId) {
        setLoading(false);
        setError('Você precisa estar logado para ver suas playlists.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Endpoint: GET http://localhost:2200/maestro/playlist/usuario/{id_logado}
        const response = await playlistApi.get(`/usuario/${userLoggedId}`);
        setPlaylists(response.data.playlists || []); 
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar minhas playlists:', err);
        setError('Não foi possível carregar suas playlists. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchMyPlaylists();
  }, [userLoggedId, isAuthenticated]); 

  const handleClickPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`); 
  };

  return (
    <div className="p-8"> {/* Padding geral para a página */}
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">
        Essas aqui são as suas criações! Se orgulhe delas!
      </h2>

      {/* Reutilizando o grid e o formato do cartão das playlists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start">
        {loading ? (
          <p className="text-[#0F1108] text-lg col-span-full">Carregando suas playlists...</p>
        ) : error ? (
          <p className="text-red-500 text-lg col-span-full">{error}</p>
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => handleClickPlaylist(playlist.id)}
              className="flex flex-col items-start text-left w-48 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-48 h-48 overflow-hidden rounded-lg mb-2 shadow-md border border-gray-200">
                <img
                  src={playlist.coverImageURL || 'https://placehold.co/192x192/E0E0E0/787878?text=Sem+Capa'}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[#0F1108] font-normal text-lg truncate w-full">{playlist.name}</p>
            </button>
          ))
        ) : (
          <p className="text-[#0F1108] text-lg col-span-full">Você ainda não criou nenhuma playlist... Ta na hora de mudar isso né?</p>
        )}
      </div>
    </div>
  );
}

export default MyPlaylistsPage;