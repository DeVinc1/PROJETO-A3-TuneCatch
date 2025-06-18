import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userApi, playlistApi, tagApi, trackApi } from '../services/api.js';

// Reutilizar a função shuffleArray (pode estar em utils ou copiada aqui)
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Reutilizar a função getCategoryColorClass para tags (pode estar em utils ou copiada aqui)
const getCategoryColorClass = (category) => {
  switch (category) {
    case 'Vibe':
      return 'bg-orange-500';
    case 'Ocasião':
      return 'bg-green-500';
    case 'Gênero Musical':
      return 'bg-blue-500';
    case 'Época':
      return 'bg-purple-500';
    default:
      return 'bg-gray-400';
  }
};

function GeneralSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [playlistsByName, setPlaylistsByName] = useState([]); // Playlists encontradas pelo nome
  const [tags, setTags] = useState([]);
  const [playlistsByTrack, setPlaylistsByTrack] = useState([]); // Playlists encontradas por músicas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation(); // Hook para acessar a URL e seus parâmetros de query

  // Efeito para extrair o termo de busca da URL e iniciar a pesquisa
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query'); // Pega o valor do parâmetro 'query'

    if (query) {
      setSearchTerm(query);
      fetchSearchResults(query); // Inicia a busca com o termo da URL
    } else {
      setSearchTerm('');
      setUsers([]);
      setPlaylistsByName([]);
      setTags([]);
      setPlaylistsByTrack([]);
      setLoading(false);
      setError(null);
    }
  }, [location.search]); // Re-executa sempre que a URL de busca muda

  const fetchSearchResults = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, playlistsResponse, tagsResponse, tracksResponse] = await Promise.allSettled([
        userApi.get(`/nome-usuario/${encodeURIComponent(query)}`),
        playlistApi.get(`/publica/${encodeURIComponent(query)}`),
        tagApi.get(`/nome/${encodeURIComponent(query)}`),
        trackApi.get(`/playlists-com-musica/${encodeURIComponent(query)}`),
      ]);

      if (usersResponse.status === 'fulfilled' && usersResponse.value.data) {

        const userData = usersResponse.value.data;
        setUsers(userData ? (Array.isArray(userData) ? userData : [userData]) : []);
      } else {
        console.error('Erro ou falha na busca de usuários:', usersResponse.reason);
        setUsers([]);
      }

      if (playlistsResponse.status === 'fulfilled' && playlistsResponse.value.data) {
        setPlaylistsByName(playlistsResponse.value.data.playlists || playlistsResponse.value.data);
      } else {
        console.error('Erro ou falha na busca de playlists por nome:', playlistsResponse.reason);
        setPlaylistsByName([]);
      }

      if (tagsResponse.status === 'fulfilled' && tagsResponse.value.data) {
        setTags(tagsResponse.value.data.tags || tagsResponse.value.data);
      } else {
        console.error('Erro ou falha na busca de tags:', tagsResponse.reason);
        setTags([]);
      }

      if (tracksResponse.status === 'fulfilled' && tracksResponse.value.data) {
        setPlaylistsByTrack(tracksResponse.value.data.playlists || tracksResponse.value.data);
      } else {
        console.error('Erro ou falha na busca de playlists por música:', tracksResponse.reason);
        setPlaylistsByTrack([]);
      }

    } catch (err) {
      console.error('Erro geral na busca:', err);
      setError('Ocorreu um erro ao realizar a busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickTag = (tagName) => {
    navigate(`/search/tags/${encodeURIComponent(tagName)}`);
  };

  const handleClickPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleClickUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleClickTrackPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#0F1108] mb-8">
        Resultados da busca por: "{searchTerm}"
      </h1>

      {loading && (
        <p className="text-[#0F1108] text-lg text-center mt-10">Carregando resultados...</p>
      )}

      {error && (
        <p className="text-red-500 text-lg text-center mt-10">{error}</p>
      )}

      {!loading && !error && searchTerm && (
        <>
          {/* Seção de Tags - Renderiza APENAS se tags.length > 0 */}
          {tags.length > 0 && (
            <>
              <h2 className="text-2xl font-normal text-[#0F1108] mb-6 mt-10">Tags Encontradas</h2>
              <div className="flex flex-wrap gap-4 justify-start mb-12">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleClickTag(tag.name)}
                    className={`
                      ${getCategoryColorClass(tag.category)}
                      text-[#FFF9F9] font-normal text-base
                      px-5 py-2.5 rounded-full shadow-md
                      transition duration-300 ease-in-out
                      hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75
                      flex items-center space-x-2
                    `}
                  >
                    <span className="text-xl">{tag.iconEmoji}</span>
                    <span>{tag.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Seção de Playlists por Nome - Renderiza APENAS se playlistsByName.length > 0 */}
          {playlistsByName.length > 0 && (
            <>
              <h2 className="text-2xl font-normal text-[#0F1108] mb-6 mt-10">Playlists por Nome</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start mb-12">
                {playlistsByName.map((playlist) => (
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
                      de @{playlist.creator?.username}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Seção de Usuários - Renderiza APENAS se users.length > 0 */}
          {users.length > 0 && (
            <>
              <h2 className="text-2xl font-normal text-[#0F1108] mb-6 mt-10">Usuários</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 justify-items-start mb-12">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleClickUser(user.id)}
                    className="flex flex-col items-start text-left w-48 transition-transform duration-300 hover:scale-105"
                  >
                    <div className="w-48 h-48 overflow-hidden rounded-full mb-2 shadow-md border-4 border-[#AF204E]">
                      <img
                        src={user.avatarURL || 'https://placehold.co/192x192/E0E0E0/787878?text=Sem+Avatar'}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[#0F1108] font-normal text-lg truncate w-full">@{user.username}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Seção de Playlists por Música - Renderiza APENAS se playlistsByTrack.length > 0 */}
          {playlistsByTrack.length > 0 && (
            <>
              <h2 className="text-2xl font-normal text-[#0F1108] mb-6 mt-10">Playlists com essa música</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start mb-12">
                {playlistsByTrack.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleClickTrackPlaylist(playlist.id)}
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
                      de @{playlist.creator?.username}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Mensagem se NENHUM resultado for encontrado em todas as categorias */}
          {(!users.length && !playlistsByName.length && !tags.length && !playlistsByTrack.length) && (
            <p className="text-[#0F1108] text-xl text-center mt-20">
              Nenhum resultado encontrado para "{searchTerm}".
            </p>
          )}
        </>
      )}

      {/* Mensagem para quando não há termo de busca na URL (e não está carregando nem erro) */}
      {!searchTerm && !loading && !error && (
        <p className="text-[#0F1108] text-xl text-center mt-20">
          Digite algo na barra de pesquisa para começar.
        </p>
      )}
    </div>
  );
}

export default GeneralSearchPage;
