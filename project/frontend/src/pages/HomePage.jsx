import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importe a API de usuários
import { tagApi, playlistApi, userApi } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx'; 
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

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

function HomePage() {
  const { userLoggedId } = useAuth(); 
  const [tags, setTags] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState(null);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [errorPlaylists, setErrorPlaylists] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagApi.get('/');
        const selectedTags = shuffleArray(response.data.tags).slice(0, 7);
        setTags(selectedTags);
        setLoadingTags(false);
      } catch (err) {
        console.error('Erro ao buscar tags:', err);
        setErrorTags('Não foi possível carregar as tags. Tente novamente mais tarde.');
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await playlistApi.get('/');
        const visiblePlaylists = response.data.playlists.filter(pl => pl.isVisible);
        const selectedPlaylists = shuffleArray(visiblePlaylists).slice(0, 14);
        setPlaylists(selectedPlaylists);
        setLoadingPlaylists(false);
      } catch (err) {
        console.error('Erro ao buscar playlists:', err);
        setErrorPlaylists('Não foi possível carregar as playlists. Tente novamente mais tarde.');
        setLoadingPlaylists(false);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const response = await userApi.get('/');
        const allUsers = response.data.users || response.data; 

        const filteredUsers = userLoggedId
          ? allUsers.filter(user => user.id !== userLoggedId)
          : allUsers;

        const selectedUsers = shuffleArray(filteredUsers).slice(0, 6);
        setUsers(selectedUsers);
        setLoadingUsers(false);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setErrorUsers('Não foi possível carregar os usuários. Tente novamente mais tarde.');
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [userLoggedId]); 

  const handleClickTag = async (tagName) => {
    navigate(`/search/tags/${encodeURIComponent(tagName)}`);
    try {
      const response = await tagApi.get(`/playlists-marcadas?q=${encodeURIComponent(tagName)}`);
      console.log(`Playlists marcadas com "${tagName}":`, response.data);
    } catch (err) {
      console.error(`Erro ao buscar playlists para a tag "${tagName}":`, err);
    }
  };

  const handleClickPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleClickUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="p-8">
      {/* Seção de Tags */}
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">Hoje é um belo dia para ouvir algo novo, não acha?</h2>
      <div className="flex flex-wrap gap-4 justify-start mb-12">
        {loadingTags ? (
          <p className="text-[#0F1108] text-lg">Carregando tags...</p>
        ) : errorTags ? (
          <p className="text-red-500 text-lg">{errorTags}</p>
        ) : tags.length > 0 ? (
          tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleClickTag(tag.name)}
              className={`
                ${getCategoryColorClass(tag.category)}
                text-[#FFF9F3] font-normal text-base
                px-5 py-2.5 rounded-full shadow-md
                transition duration-300 ease-in-out
                hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75
                flex items-center space-x-2
              `}
            >
              <span className="text-xl">{tag.iconEmoji}</span>
              <span>{tag.name}</span>
            </button>
          ))
        ) : (
          <p className="text-[#0F1108] text-lg">Nenhuma tag encontrada no momento.</p>
        )}
      </div>

      {/* Seção de Playlists Aleatórias */}
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">Que tal ouvir essas aqui?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start mb-12">
        {loadingPlaylists ? (
          <p className="text-[#0F1108] text-lg col-span-full">Carregando playlists...</p>
        ) : errorPlaylists ? (
          <p className="text-red-500 text-lg col-span-full">{errorPlaylists}</p>
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
          <p className="text-[#0F1108] text-lg col-span-full">Nenhuma playlist pública encontrada no momento.</p>
        )}
      </div>

      {/* Nova Seção de Usuários Aleatórios */}
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">Que tal fazer novos amigos?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 justify-items-start"> {/* Alterado xl:grid-cols-7 para xl:grid-cols-6 */}
        {loadingUsers ? (
          <p className="text-[#0F1108] text-lg col-span-full">Carregando usuários...</p>
        ) : errorUsers ? (
          <p className="text-red-500 text-lg col-span-full">{errorUsers}</p>
        ) : users.length > 0 ? (
          users.map((user) => (
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
          ))
        ) : (
          <p className="text-[#0F1108] text-lg col-span-full">Nenhum usuário encontrado no momento.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;