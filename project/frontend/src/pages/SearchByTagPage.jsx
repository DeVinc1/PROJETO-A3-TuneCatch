import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { tagApi } from '../services/api.js';

function SearchByTagPage() {
  const { tagQuery } = useParams(); 
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylistsByTag = async () => {
      if (!tagQuery) {
        setLoading(false);
        setError('Nenhuma tag fornecida para busca.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Endpoint: GET http://localhost:2250/maestro/tag/playlists-marcadas?q={nome_tag}
        const response = await tagApi.get(`/playlists-marcadas?q=${encodeURIComponent(tagQuery)}`);
        
        const visiblePlaylists = response.data.playlists.filter(pl => pl.isVisible);
        
        setPlaylists(visiblePlaylists || []);
        setLoading(false);
      } catch (err) {
        console.error(`Erro ao buscar playlists para a tag "${tagQuery}":`, err);
        setError('Não foi possível carregar as playlists para esta tag. Tente novamente mais tarde.');
        setPlaylists([]); 
        setLoading(false);
      }
    };

    fetchPlaylistsByTag();
  }, [tagQuery]); 

  const handleClickPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`); 
  };

  return (
    <div className="p-8"> {/* Padding geral para a página */}
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">
        Playlists marcadas com: "{tagQuery}"
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
              <p className="text-[#0F1108] font-normal text-sm opacity-80 w-full">
                de @{playlist.creator.username}
              </p>
            </button>
          ))
        ) : (
          <p className="text-[#0F1108] text-lg col-span-full">Nenhuma playlist encontrada para a tag "{tagQuery}".</p>
        )}
      </div>
    </div>
  );
}

export default SearchByTagPage;