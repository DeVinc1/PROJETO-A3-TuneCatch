import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { playlistApi } from '../services/api.js';

function PlaylistsFromUserPage() {
  const { id } = useParams(); 
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatorUsername, setCreatorUsername] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!id) {
        setLoading(false);
        setError('ID de usuário não fornecido na URL.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Endpoint: GET http://localhost:2200/maestro/playlist/usuario/{id_URL}
        const response = await playlistApi.get(`/usuario/${id}`);
        const visiblePlaylists = response.data.playlists.filter(pl => pl.isVisible);
        
        setPlaylists(visiblePlaylists || []);

        if (visiblePlaylists.length > 0 && visiblePlaylists[0].creator && visiblePlaylists[0].creator.username) {
          setCreatorUsername(visiblePlaylists[0].creator.username);
        } else {

        }

        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar playlists do usuário:', err);
        setError('Não foi possível carregar as playlists deste usuário. Tente novamente mais tarde.');
        setPlaylists([]); 
        setLoading(false);
      }
    };

    fetchUserPlaylists();
  }, [id]);

  const handleClickPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`); 
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">
        {creatorUsername ? `@${creatorUsername}` : 'Este usuário'} criou essas aqui! Vai que você gosta de alguma...
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start">
        {loading ? (
          <p className="text-[#0F1108] text-lg col-span-full">Carregando playlists...</p>
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
          <p className="text-[#0F1108] text-lg col-span-full">Este usuário ainda não criou playlists públicas...</p>
        )}
      </div>
    </div>
  );
}

export default PlaylistsFromUserPage;