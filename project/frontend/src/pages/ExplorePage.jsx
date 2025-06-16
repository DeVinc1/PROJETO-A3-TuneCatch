import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistApi, tagApi } from '../services/api.js';

// Função auxiliar para embaralhar um array (Fisher-Yates shuffle)
function shuffleArray(array) {
  // Cria uma cópia do array para não modificar o original diretamente se ele vier de uma fonte imutável
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Função auxiliar para obter a classe de cor com base na categoria
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

function ExplorePage() {
  const [playlists, setPlaylists] = useState([]);
  const [exploreSectionTags, setExploreSectionTags] = useState([]); // Estado para as tags da seção "Explore"
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [errorPlaylists, setErrorPlaylists] = useState(null);
  const [loadingExploreTags, setLoadingExploreTags] = useState(true);
  const [errorExploreTags, setErrorExploreTags] = useState(null);
  const navigate = useNavigate();

  // useEffect para buscar Playlists (mantido inalterado)
  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoadingPlaylists(true);
      setErrorPlaylists(null);
      try {
        const response = await playlistApi.get('/');
        const visiblePlaylists = response.data.playlists.filter(pl => pl.isVisible);
        const sortedPlaylists = [...visiblePlaylists].sort((a, b) => b.likes - a.likes);
        const top7Playlists = sortedPlaylists.slice(0, 7);
        setPlaylists(top7Playlists);
        setLoadingPlaylists(false);
      } catch (err) {
        console.error('Erro ao buscar playlists mais curtidas:', err);
        setErrorPlaylists('Não foi possível carregar as playlists. Tente novamente mais tarde.');
        setLoadingPlaylists(false);
      }
    };

    fetchPlaylists();
  }, []);

  // useEffect para buscar as Tags para a seção "Explore"
  useEffect(() => {
    const fetchExploreTags = async () => {
      setLoadingExploreTags(true);
      setErrorExploreTags(null);
      try {
        const response = await tagApi.get('/');
        // Aplica o shuffleArray aqui para embaralhar as tags antes de exibi-las
        const shuffledTags = shuffleArray(response.data.tags);
        setExploreSectionTags(shuffledTags);
        setLoadingExploreTags(false);
      } catch (err) {
        console.error('Erro ao buscar tags para seção Explore:', err);
        setErrorExploreTags('Não foi possível carregar as categorias. Tente novamente mais tarde.');
        setLoadingExploreTags(false);
      }
    };

    fetchExploreTags();
  }, []); // O array de dependências está vazio, então ele só roda na montagem

  const handleClickPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleClickExploreTag = (tagName) => {
    navigate(`/search/tags/${encodeURIComponent(tagName)}`);
  };

  return (
    <div className="p-8">
      {/* Seção de Playlists mais Curtidas */}
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">
        Se todos gostam dessas playlists aqui, porque você não gostaria?
      </h2>

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

      {/* NOVA SEÇÃO DE TAGS MAIORES COM LAYOUT DE 3 COLUNAS */}
      <h2 className="text-2xl font-normal text-[#0F1108] mb-6">
        Venha conhecer um mundo inteiro de novas músicas!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] justify-items-start">
        {loadingExploreTags ? (
          <p className="text-[#0F1108] text-lg col-span-full">Carregando categorias...</p>
        ) : errorExploreTags ? (
          <p className="text-red-500 text-lg col-span-full">{errorExploreTags}</p>
        ) : exploreSectionTags.length > 0 ? (
          exploreSectionTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleClickExploreTag(tag.name)}
              className={`
                ${getCategoryColorClass(tag.category)}
                text-[#FFF3F3] font-normal text-xl
                px-6 py-4 rounded-xl shadow-lg
                transition duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-opacity-75
                flex flex-col items-center justify-center space-y-3
                w-full h-40
              `}
            >
              <span className="text-4xl">{tag.iconEmoji}</span>
              <span>{tag.name}</span>
            </button>
          ))
        ) : (
          <p className="text-[#0F1108] text-lg col-span-full">Nenhuma categoria encontrada no momento.</p>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;