import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playlistApi, userApi, tagApi, trackApi } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePlayer } from '../contexts/PlayerContext.jsx'; // NOVO: Importe o usePlayer
import { FaPlus, FaCheck, FaSearch, FaTimes, FaPencilAlt, FaHeart } from 'react-icons/fa';

// Função para obter a classe de cor com base na categoria da tag
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

// Função para converter milissegundos para MM:SS
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

function PlaylistPage() {
  const { playlistId } = useParams();
  const { userLoggedId, isAuthenticated } = useAuth();
  const { playTrack, selectedTrackId } = usePlayer(); // NOVO: Obtenha playTrack e selectedTrackId do PlayerContext

  const [playlistData, setPlaylistData] = useState(null);
  const [creatorAvatar, setCreatorAvatar] = useState(null);
  const [playlistTags, setPlaylistTags] = useState([]); // Tags atualmente na playlist
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o modal de adicionar músicas
  const [showAddMusicModal, setShowAddMusicModal] = useState(false);
  const [searchMusicTerm, setSearchMusicTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addingTrackId, setAddingTrackId] = useState(null);
  const [addedTracksToCurrentPlaylist, setAddedTracksToCurrentPlaylist] = useState(new Set()); // IDs das músicas adicionadas nesta sessão do modal

  // Estados para o modal de editar playlist
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [editPlaylistDescription, setEditPlaylistDescription] = useState('');
  const [editPlaylistIsVisible, setEditPlaylistIsVisible] = useState(true);
  const [editPlaylistCoverImageURL, setEditPlaylistCoverImageURL] = useState('');
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [editFormError, setEditFormError] = useState(null);
  const [editFormSuccess, setEditFormSuccess] = useState(null);

  // Estados para o menu de contexto (clique direito na música)
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, trackId: null, spotifyID: null });
  const contextMenuRef = useRef(null);

  // Estados para o menu de contexto da capa da playlist
  const [coverContextMenu, setCoverContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const coverImageRef = useRef(null);
  const coverContextMenuRef = useRef(null);

  // Estados para o modal de adicionar tags
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [availableTags, setAvailableTags] = useState([]); // Todas as tags disponíveis da API
  const [loadingAvailableTags, setLoadingAvailableTags] = useState(true);
  const [errorAvailableTags, setErrorAvailableTags] = useState(null);
  const [addingTagId, setAddingTagId] = useState(null);

  // Estados para o botão de curtir/descurtir
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState(null);
  const [loggedInUserLikedPlaylists, setLoggedInUserLikedPlaylists] = useState([]);


  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [playlistResponse, tagsResponse, tracksResponse] = await Promise.allSettled([
        playlistApi.get(`/${playlistId}`),
        tagApi.get(`/playlists-tags/${playlistId}`),
        trackApi.get(`/playlist-musicas/${playlistId}`),
      ]);

      if (playlistResponse.status === 'fulfilled' && playlistResponse.value.data) {
        setPlaylistData(playlistResponse.value.data);
        setEditPlaylistName(playlistResponse.value.data.name || '');
        setEditPlaylistDescription(playlistResponse.value.data.description || '');
        setEditPlaylistIsVisible(playlistResponse.value.data.isVisible);
        setEditPlaylistCoverImageURL(playlistResponse.value.data.coverImageURL || '');

        if (playlistResponse.value.data.creatorId) {
          try {
            const avatarRes = await userApi.get(`/${playlistResponse.value.data.creatorId}`);
            if (avatarRes.data && avatarRes.data.avatarURL) {
              setCreatorAvatar(avatarRes.data.avatarURL);
            }
          } catch (avatarErr) {
            console.error("Erro ao buscar avatar do criador:", avatarErr);
            setCreatorAvatar(null);
          }
        }
      } else {
        console.error('Falha ao buscar dados da playlist:', playlistResponse.reason);
        setError('Não foi possível carregar os detalhes da playlist.');
      }

      if (tagsResponse.status === 'fulfilled' && tagsResponse.value.data) {
        setPlaylistTags(tagsResponse.value.data.tags || []);
      } else {
        console.error('Falha ao buscar tags da playlist:', tagsResponse.reason);
        setPlaylistTags([]);
      }

      if (tracksResponse.status === 'fulfilled' && tracksResponse.value.data) {
        setPlaylistTracks(tracksResponse.value.data.tracks || []);
        setAddedTracksToCurrentPlaylist(new Set(tracksResponse.value.data.tracks.map(t => t.spotifyID)));
      } else {
        console.error('Falha ao buscar músicas da playlist:', tracksResponse.reason);
        setPlaylistTracks([]);
      }

    } catch (err) {
      console.error('Erro geral ao buscar dados da playlist:', err);
      setError('Ocorreu um erro ao carregar a playlist. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  // Função para buscar as playlists curtidas pelo usuário logado
  const fetchLoggedInUserLikedPlaylists = useCallback(async () => {
    if (!isAuthenticated || !userLoggedId) {
      setLoggedInUserLikedPlaylists([]);
      return;
    }
    try {
      const response = await userApi.get(`/${userLoggedId}`);
      setLoggedInUserLikedPlaylists(response.data.likedPlaylists || []);
    } catch (err) {
      console.error("Erro ao buscar playlists curtidas do usuário logado:", err);
      setLoggedInUserLikedPlaylists([]);
    }
  }, [isAuthenticated, userLoggedId]);

  useEffect(() => {
    if (playlistId) {
      fetchData();
    } else {
      setError("ID da playlist não fornecido na URL.");
      setLoading(false);
    }
  }, [playlistId, fetchData]);

  useEffect(() => {
    if (loggedInUserLikedPlaylists.length > 0 && playlistData) {
      const isPlaylistCurrentlyLiked = loggedInUserLikedPlaylists.some(pl => pl.id === playlistData.id);
      setIsLiked(isPlaylistCurrentlyLiked);
    } else if (loggedInUserLikedPlaylists.length === 0 && playlistData) {
        setIsLiked(false);
    }
  }, [loggedInUserLikedPlaylists, playlistData]);

  useEffect(() => {
    fetchLoggedInUserLikedPlaylists();
  }, [fetchLoggedInUserLikedPlaylists]);


  // Efeito para fechar menus de contexto ao clicar fora (incluindo o novo da capa)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ visible: false, x: 0, y: 0, trackId: null, spotifyID: null });
      }
      if (coverContextMenuRef.current && !coverContextMenuRef.current.contains(event.target)) {
        setCoverContextMenu({ visible: false, x: 0, y: 0 });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Sem dependências para que o listener seja configurado uma única vez

  // useEffect para buscar todas as tags disponíveis quando o modal de tags for aberto
  useEffect(() => {
    if (showAddTagModal) {
      const fetchAvailableTags = async () => {
        setLoadingAvailableTags(true);
        setErrorAvailableTags(null);
        try {
          const response = await tagApi.get('/');
          setAvailableTags(response.data.tags || []);
        } catch (err) {
          console.error("Erro ao buscar tags disponíveis:", err);
          setErrorAvailableTags("Não foi possível carregar as tags disponíveis.");
        } finally {
          setLoadingAvailableTags(false);
        }
      };
      fetchAvailableTags();
    }
  }, [showAddTagModal]);


  // --- Lógica de busca de músicas (com debounce) ---
  const searchTimeoutRef = useRef(null);
  const handleMusicSearchChange = (e) => {
    const term = e.target.value;
    setSearchMusicTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await trackApi.get(`/pesquisa/${encodeURIComponent(term)}`);
        setSearchResults(response.data.tracks || []);
      } catch (err) {
        console.error("Erro ao pesquisar músicas:", err);
        setSearchResults([]);
      }
    }, 500);
  };


  // --- Lógica de adicionar música à playlist ---
  const handleAddTrackToPlaylist = async (trackId, spotifyID) => {
    if (addedTracksToCurrentPlaylist.has(spotifyID)) {
      console.log('Música já adicionada a esta playlist.');
      return;
    }
    setAddingTrackId(spotifyID);
    try {
      await trackApi.post(`/adicionar/${spotifyID}`, { playlistId: playlistId });
      console.log(`Música ${spotifyID} adicionada à playlist ${playlistId}`);
      
      setAddedTracksToCurrentPlaylist(prev => new Set(prev).add(spotifyID));
      await fetchData();
    } catch (err) {
      console.error("Erro ao adicionar música:", err);
    } finally {
      setAddingTrackId(null);
    }
  };

  // Lógica de remover música da playlist
  const handleRemoveTrack = async () => {
    if (!contextMenu.trackId || !playlistData || !isOwner) {
      console.log("Não é possível remover a música: dados incompletos ou não é o dono da playlist.");
      setContextMenu({ visible: false, x: 0, y: 0, trackId: null, spotifyID: null });
      return;
    }
    try {
      await trackApi.delete(`/${playlistId}/${contextMenu.trackId}`);
      console.log(`Música ${contextMenu.trackId} removida da playlist ${playlistId}`);
      
      await fetchData();
    } catch (err) {
      console.error("Erro ao remover música:", err);
    } finally {
      setContextMenu({ visible: false, x: 0, y: 0, trackId: null, spotifyID: null });
    }
  };

  // Lógica para adicionar tag à playlist
  const handleAddTagToPlaylist = async (tagId) => {
    if (playlistTags.some(tag => tag.id === tagId)) {
        console.log('Tag já adicionada a esta playlist.');
        return;
    }
    setAddingTagId(tagId);
    try {
      await tagApi.post(`/adicionar/${playlistId}`, { tagId: tagId });
      console.log(`Tag ${tagId} adicionada à playlist ${playlistId}`);
      
      await fetchData();
    } catch (err) {
      console.error("Erro ao adicionar tag:", err);
    } finally {
      setAddingTagId(null);
    }
  };


  // --- Handlers de Abertura/Fechamento de Modais ---
  const handleAddMusicClick = () => {
    setShowAddMusicModal(true);
    setSearchMusicTerm('');
    setSearchResults([]);
    setAddingTrackId(null);
  };

  const handleCloseAddMusicModal = () => {
    setShowAddMusicModal(false);
    setSearchMusicTerm('');
    setSearchResults([]);
    setAddingTrackId(null);
  };

  const handleEditPlaylistClick = () => {
    setShowEditPlaylistModal(true);
    setEditFormError(null);
    setEditFormSuccess(null);
  };

  const handleCloseEditPlaylistModal = () => {
    setShowEditPlaylistModal(false);
    setEditFormError(null);
    setEditFormSuccess(null);
  };

  const handleSubmitEditPlaylist = async (e) => {
    e.preventDefault();
    setEditFormLoading(true);
    setEditFormError(null);
    setEditFormSuccess(null);

    const payload = {
      name: editPlaylistName,
      description: editPlaylistDescription,
      isVisible: editPlaylistIsVisible,
      coverImageURL: editPlaylistCoverImageURL,
    };

    try {
      await playlistApi.put(`/${playlistId}`, payload);
      console.log("Playlist atualizada com sucesso:", payload);
      setEditFormSuccess("Playlist atualizada com sucesso!");
      
      await fetchData();
      
      setTimeout(() => {
        setShowEditPlaylistModal(false);
      }, 1500);

    } catch (err) {
      console.error("Erro ao atualizar playlist:", err);
      const errorMessage = err.response?.data?.message || "Erro ao atualizar playlist. Verifique os dados.";
      setEditFormError(errorMessage);
    } finally {
      setEditFormLoading(false);
    }
  };

  // Handlers para o Modal de Adicionar Tags
  const handleAddTagClick = () => {
    setShowAddTagModal(true);
  };

  const handleCloseAddTagModal = () => {
    setShowAddTagModal(false);
    setAddingTagId(null);
  };

  // Handler para o clique direito na capa da playlist
  const handleCoverContextMenu = (event) => {
    event.preventDefault();
    if (isOwner) {
      setCoverContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
      });
    } else {
        console.log("Você não é o dono desta playlist para deletá-la.");
    }
  };

  // Lógica para deletar a playlist
  const handleDeletePlaylist = async () => {
    setCoverContextMenu({ visible: false, x: 0, y: 0 }); // Fecha o menu
    setLoading(true); // Ativa o loading geral da página
    try {
      await playlistApi.delete(`/${playlistId}`);
      console.log(`Playlist ${playlistId} deletada com sucesso!`);
      navigate('/my-playlists'); // Redireciona para Minhas Playlists após a exclusão
    } catch (err) {
      console.error("Erro ao deletar playlist:", err);
      setError("Não foi possível deletar a playlist. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Handler para o botão de curtir/descurtir
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login'); // Redireciona para login se não autenticado
      return;
    }
    setLikeLoading(true);
    setLikeError(null);
    try {
      const response = await playlistApi.post(`/curtir/${userLoggedId}`, { playlistId: playlistId });
      console.log("Ação de curtir/descurtir playlist:", response.data);

      await fetchData(); // Re-fetch dos dados da playlist para atualizar a contagem de likes
      await fetchLoggedInUserLikedPlaylists(); // Re-fetch das playlists curtidas do usuário logado para atualizar o estado 'isLiked' do botão

    } catch (err) {
      console.error("Erro ao curtir/descurtir playlist:", err);
      setLikeError(err.response?.data?.message || "Erro ao curtir/descurtir. Tente novamente.");
    } finally {
      setLikeLoading(false);
    }
  };


  // --- Outros Handlers ---
  const handleTrackContextMenu = (event, track) => {
    event.preventDefault();
    if (isOwner) {
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        trackId: track.id,
        spotifyID: track.spotifyID,
      });
    } else {
        console.log("Você não é o dono desta playlist para remover músicas.");
    }
  };

  const handleClickCreatorProfile = (creatorId) => {
    if (creatorId) {
      navigate(`/users/${creatorId}`);
    }
  };

  const handleClickTrack = (track) => {
    // Toca a música usando o contexto do player
    playTrack(track.spotifyID, track.id); // Passa o spotifyID e o ID interno para highlight
    console.log("Música clicada:", track.trackName, "Spotify ID:", track.spotifyID);
  };


  // --- Renderização Condicional (Loading, Error, No Data) ---
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-[#0F1108] text-lg">Carregando playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!playlistData) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-[#0F1108] text-lg">Playlist não encontrada ou ID inválido.</p>
      </div>
    );
  }

  const isOwner = isAuthenticated && userLoggedId === playlistData?.creatorId;

  return (
    <div className="p-8">
      {/* Informações da Playlist (cabeçalho) */}
      <div className="flex items-start gap-8 mb-10">
        {/* Imagem da Playlist Grande */}
        <div
            ref={coverImageRef}
            onContextMenu={handleCoverContextMenu}
            className="relative w-[350px] h-[350px] flex-shrink-0 cursor-context-menu"
        >
          <img
            src={playlistData.coverImageURL || 'https://placehold.co/256x256/E0E0E0/787878?text=Sem+Capa'}
            alt={playlistData.name}
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
        </div>

        {/* Detalhes da Playlist */}
        <div className="flex flex-col flex-grow">
          {/* "Playlist de @Username" com imagem de perfil pequena */}
          <button
            onClick={() => handleClickCreatorProfile(playlistData.creatorId)}
            className="flex items-center text-[#0F1108] text-base font-normal mb-2 self-start hover:underline transition-colors duration-200"
          >
            Playlist de @{playlistData.creator.username}
            {creatorAvatar && (
              <img
                src={creatorAvatar}
                alt={playlistData.creator.username}
                className="w-8 h-8 rounded-full object-cover ml-2 border-2 border-[#AF204E]"
              />
            )}
          </button>

          {/* Nome da Playlist */}
          <h1 className="text-5xl font-bold text-[#0F1108] mb-2">{playlistData.name}</h1>

          {/* Descrição da Playlist */}
          {playlistData.description && (
            <p className="text-[#0F1108] text-lg italic mb-6">{playlistData.description}</p>
          )}

          {/* Tags da Playlist */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {playlistTags.length > 0 && (
              playlistTags.map(tag => (
                <button
                  key={tag.id}
                  className={`
                    ${getCategoryColorClass(tag.category)}
                    text-[#FFF3F3] font-normal text-sm
                    px-3 py-1 rounded-full shadow-md
                    transition duration-200 hover:scale-105
                  `}
                >
                  <span className="text-xl mr-1">{tag.iconEmoji}</span>
                  <span>{tag.name}</span>
                </button>
              ))
            )}
            {/* Botão para Adicionar Tags (apenas se for o dono) */}
            {isOwner && (
              <button
                onClick={handleAddTagClick}
                className="w-10 h-10 rounded-full border-2 border-[#0F1108] flex items-center justify-center text-[#0F1108] focus:outline-none focus:ring-2 focus:ring-[#0F1108]/50 transition-colors duration-200 hover:bg-gray-100"
              >
                <img src="https://img.icons8.com/?size=100&id=84989&format=png&color=0F1108" alt="Adicionar Tag" className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Likes Count */}
          <p className="text-[#0F1108] text-xl">
            <span className="font-normal">{playlistData.likes || 0}</span> <span className="font-bold">Catches</span>
          </p>

          {/* Botões de Ação da Playlist (condicionais) */}
          <div className="flex flex-wrap items-center space-x-4 mt-6">
            {isOwner && (
                <> {/* Fragmento para agrupar botões do dono */}
                    <button
                        onClick={handleAddMusicClick}
                        className={`bg-[#AF204E] text-[#FFF9F9] font-bold py-2.5 px-8 rounded-full
                                border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                                focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]'}`}
                        disabled={loading}
                    >
                        + Adicionar músicas
                    </button>
                    <button
                        onClick={handleEditPlaylistClick}
                        className={`bg-transparent text-[#0F1108] font-bold py-2 px-10 rounded-full
                                border-2 border-[#0F1108]
                                focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-100 hover:shadow-md'}
                                flex items-center justify-center`}
                        disabled={loading}
                    >
                        <FaPencilAlt className="mr-2" />
                        Editar playlist
                    </button>
                </>
            )}
            {/* Botão Curtir/Descurtir (Visível se NÃO for o dono E autenticado) */}
            {!isOwner && isAuthenticated && (
                <button
                    onClick={handleLikeToggle}
                    className={`text-sm font-bold py-2 px-8 rounded-full transition duration-300 ease-in-out
                               ${likeLoading ? 'opacity-70 cursor-not-allowed' : ''}
                               ${isLiked
                                   ? 'bg-[#FFF3F3] text-[#AF204E] border-2 border-[#AF204E] shadow-[0px_0px_0px_3px_#FFF3F3] hover:bg-gray-100 hover:shadow-[0px_0px_0px_3px_#C93B6E]' // Descurtir
                                   : 'bg-[#AF204E] text-[#FFF9F9] border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E] hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]'}` // Curtir
                               }
                    disabled={likeLoading || loading}
                >
                    <FaHeart className="mr-2 inline-block" />
                    {likeLoading ? 'Processando...' : (isLiked ? 'Descurtir' : 'Curtir')}
                </button>
            )}
            {likeError && (
                <p className="text-red-500 text-sm mt-2">{likeError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Linha Horizontal Separadora */}
      <hr className="mt-10 border-t-2 border-[#E67A9D]" />

      {/* Seção de Músicas da Playlist */}
      {playlistTracks.length > 0 ? (
        <div className="w-full">
          {/* Cabeçalho da Tabela (Música, Álbum, Duração) */}
          <div className="grid grid-cols-[2fr_1.5fr_0.5fr] text-[#0F1108] font-bold text-lg pb-2 mt-6">
            <p className="text-left">Música</p>
            <p className="text-left">Álbum</p>
            <p className="text-right">Duração</p>
          </div>

          {/* Lista de Músicas */}
          {playlistTracks.map((track) => {
            // Determina se esta música é a selecionada para o highlight
            const isSelected = selectedTrackId === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleClickTrack(track)}
                onContextMenu={(e) => handleTrackContextMenu(e, track)}
                className={`grid grid-cols-[2fr_1.5fr_0.5fr] items-center gap-4 py-3 px-2 rounded-lg transition-colors duration-200 w-full text-left
                           ${isSelected ? 'bg-[#AF204E]/25' : 'hover:bg-[#AF204E]/15'}`} 
              >
                {/* Info da Música */}
                <div className="flex items-center min-w-0">
                  <img
                    src={track.albumCoverURL || 'https://placehold.co/64x64/E0E0E0/787878?text=Track'}
                    alt={track.trackName}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="text-[#0F1108] font-semibold text-base truncate w-full">{track.trackName}</p>
                    <p className="text-[#0F1108] text-sm opacity-80 truncate w-full">{track.artistName}</p>
                  </div>
                </div>

                {/* Nome do Álbum */}
                <p className="text-[#0F1108] text-base truncate w-full min-w-0">{track.albumName}</p>

                {/* Duração */}
                <p className="text-[#0F1108] text-base text-right">{formatDuration(track.durationMs)}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-lg col-span-full mt-8 text-[#76868C]">
          Tá um silêncio por aqui, não acha?
        </p>
      )}

      {/* Menu de Contexto (Remover Música) */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white p-2 rounded-lg shadow-lg border border-gray-200 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu({ visible: false, x: 0, y: 0, trackId: null, spotifyID: null })}
        >
          {isOwner ? (
            <button
              onClick={handleRemoveTrack}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
            >
              Remover da Playlist
            </button>
          ) : (
            <p className="text-gray-500 text-sm px-4 py-2">Você não é o dono desta playlist.</p>
          )}
        </div>
      )}

      {/* Menu de Contexto da Capa da Playlist (Deletar Playlist) */}
      {coverContextMenu.visible && (
        <div
          ref={coverContextMenuRef}
          className="fixed bg-white p-2 rounded-lg shadow-lg border border-gray-200 z-50"
          style={{ top: coverContextMenu.y, left: coverContextMenu.x }}
          onClick={() => setCoverContextMenu({ visible: false, x: 0, y: 0 })}
        >
          <button
            onClick={handleDeletePlaylist}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
          >
            Deletar Playlist
          </button>
        </div>
      )}

      {/* Modal de Adicionar Músicas */}
      {showAddMusicModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#FFF3F3] p-8 rounded-lg shadow-2xl border-2 border-[#AF204E] text-center w-full max-w-2xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0F1108]">Adicionar Músicas</h2>
              <button onClick={handleCloseAddMusicModal} className="text-[#0F1108] hover:text-red-500 transition-colors">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Campo de Pesquisa no Modal */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Pesquisar músicas..."
                className="w-full py-3 px-4 rounded-full border-2 border-[#AF204E] bg-[#FFF9F9]
                           text-[#0F1108] placeholder-[#76868C] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50"
                value={searchMusicTerm}
                onChange={handleMusicSearchChange}
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AF204E]" />
            </div>

            {/* Resultados da Pesquisa */}
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {searchResults.length > 0 ? (
                <div className="w-full">
                  {/* Cabeçalho da Lista de Resultados */}
                  <div className="grid grid-cols-[3fr_2fr_0.5fr] text-[#0F1108] font-bold text-lg pb-2 mb-4">
                    <p className="text-left">Música</p>
                    <p className="text-left">Álbum</p>
                    <p className="text-right">Duração</p>
                  </div>

                  {/* Lista de Músicas (Resultados da Pesquisa) */}
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="grid grid-cols-[3fr_2fr_0.5fr_0.5fr] items-center gap-4 py-3 px-2 rounded-lg hover:bg-[#AF204E]/15 transition-colors duration-200 w-full text-left"
                    >
                      {/* Info da Música */}
                      <div className="flex items-center min-w-0">
                        <img
                          src={track.album.coverImageUrl || 'https://placehold.co/40x40/E0E0E0/787878?text=Track'}
                          alt={track.name}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div className="flex flex-col min-w-0">
                          <p className="text-[#0F1108] font-semibold text-base truncate w-full">{track.name}</p>
                          <p className="text-[#0F1108] text-sm opacity-80 truncate w-full">{track.artists}</p>
                        </div>
                      </div>

                      {/* Nome do Álbum */}
                      <p className="text-[#0F1108] text-base truncate w-full min-w-0">{track.album.name}</p>

                      {/* Duração */}
                      <p className="text-[#0F1108] text-base text-right">{track.duration}</p>

                      {/* Botão de Adicionar/Check */}
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => handleAddTrackToPlaylist(track.id, track.id)}
                          disabled={addingTrackId === track.id || addedTracksToCurrentPlaylist.has(track.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                                     ${addedTracksToCurrentPlaylist.has(track.id) ? 'bg-green-500' : 'bg-[#AF204E] hover:bg-[#C93B6E]'}
                                     ${addingTrackId === track.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {addingTrackId === track.id ? (
                            <span className="text-white text-sm">...</span>
                          ) : addedTracksToCurrentPlaylist.has(track.id) ? (
                            <FaCheck className="text-white text-sm" />
                          ) : (
                            <FaPlus className="text-white text-sm" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchMusicTerm.trim() === '' ? (
                <p className="text-[#0F1108] text-lg text-center mt-10">
                  Comece a digitar para pesquisar músicas.
                </p>
              ) : (
                <p className="text-[#0F1108] text-lg text-center mt-10">
                  Nenhuma música encontrada para "{searchMusicTerm}".
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Playlist */}
      {showEditPlaylistModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#FFF3F3] p-8 rounded-lg shadow-2xl border-2 border-[#AF204E] text-center w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0F1108]">Editar Detalhes da Playlist</h2>
              <button onClick={handleCloseEditPlaylistModal} className="text-[#0F1108] hover:text-red-500 transition-colors">
                <FaTimes size={24} />
              </button>
            </div>

            {editFormError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                <strong className="font-bold">Erro!</strong>
                <span className="block sm:inline ml-2">{editFormError}</span>
              </div>
            )}
            {editFormSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                <strong className="font-bold">Sucesso!</strong>
                <span className="block sm:inline ml-2">{editFormSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitEditPlaylist} className="text-left">
              {/* Nome da Playlist */}
              <div className="mb-4">
                <label htmlFor="editPlaylistName" className="block text-[#0F1108] text-sm font-semibold mb-2">Nome da Playlist:</label>
                <input
                  type="text"
                  id="editPlaylistName"
                  className="w-full py-2 px-3 rounded-md border border-gray-300 bg-[#FFF9F9] text-[#0F1108] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50"
                  value={editPlaylistName}
                  onChange={(e) => setEditPlaylistName(e.target.value)}
                  required
                />
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <label htmlFor="editPlaylistDescription" className="block text-[#0F1108] text-sm font-semibold mb-2">Descrição:</label>
                <textarea
                  id="editPlaylistDescription"
                  className="w-full py-2 px-3 rounded-md border border-gray-300 bg-[#FFF9F9] text-[#0F1108] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50 h-24 resize-none"
                  value={editPlaylistDescription}
                  onChange={(e) => setEditPlaylistDescription(e.target.value)}
                ></textarea>
              </div>

              {/* URL da Capa */}
              <div className="mb-4">
                <label htmlFor="editPlaylistCoverImageURL" className="block text-[#0F1108] text-sm font-semibold mb-2">URL da Imagem de Capa:</label>
                <input
                  type="url"
                  id="editPlaylistCoverImageURL"
                  className="w-full py-2 px-3 rounded-md border border-gray-300 bg-[#FFF9F9] text-[#0F1108] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50"
                  value={editPlaylistCoverImageURL}
                  onChange={(e) => setEditPlaylistCoverImageURL(e.target.value)}
                />
              </div>

              {/* Visibilidade */}
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="editPlaylistIsVisible"
                  className="mr-2 h-4 w-4 text-[#AF204E] rounded border-gray-300 focus:ring-[#AF204E]"
                  checked={editPlaylistIsVisible}
                  onChange={(e) => setEditPlaylistIsVisible(e.target.checked)}
                />
                <label htmlFor="editPlaylistIsVisible" className="text-[#0F1108] text-sm font-semibold">Tornar playlist pública?</label>
              </div>

              {/* Botões de Ação do Modal */}
              <div className="flex justify-around space-x-4 mt-6">
                <button
                  type="submit"
                  className={`bg-[#AF204E] text-[#FFF3F3] font-bold py-2 px-8 rounded-full
                             border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                             focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                             ${editFormLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]'}`}
                  disabled={editFormLoading}
                >
                  {editFormLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditPlaylistModal}
                  className="bg-gray-300 text-[#0F1108] font-bold py-2 px-8 rounded-full
                             hover:bg-gray-400 transition duration-300"
                  disabled={editFormLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Tags */}
      {showAddTagModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#FFF3F3] p-8 rounded-lg shadow-2xl border-2 border-[#AF204E] text-center w-full max-w-xl h-4/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#0F1108]">Adicionar Tags</h2>
              <button onClick={handleCloseAddTagModal} className="text-[#0F1108] hover:text-red-500 transition-colors">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Lista de Tags Disponíveis */}
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {loadingAvailableTags ? (
                <p className="text-[#0F1108] text-lg text-center mt-10">Carregando tags disponíveis...</p>
              ) : errorAvailableTags ? (
                <p className="text-red-500 text-lg text-center mt-10">{errorAvailableTags}</p>
              ) : availableTags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-start">
                  {availableTags.map(tag => {
                    const isTagAlreadyAdded = playlistTags.some(plTag => plTag.id === tag.id);
                    const isAddingCurrentTag = addingTagId === tag.id;

                    return (
                      <div
                        key={tag.id}
                        className={`relative flex flex-col items-center p-4 rounded-xl shadow-md w-full
                                    ${getCategoryColorClass(tag.category)}`}
                      >
                        {/* Ícone e Nome da Tag */}
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-3xl mr-2 text-[#FFF3F3]">{tag.iconEmoji}</span>
                          <p className="text-lg font-semibold text-[#FFF3F3]">{tag.name}</p>
                        </div>
                        {/* Categoria */}
                        <p className="text-sm text-[#FFF3F3] opacity-80 mb-3">{tag.category}</p>

                        {/* Botão de Adicionar Tag */}
                        <button
                          onClick={() => handleAddTagToPlaylist(tag.id)}
                          disabled={isTagAlreadyAdded || isAddingCurrentTag}
                          className={`w-full py-2 rounded-full font-bold transition-colors duration-200
                                     ${isTagAlreadyAdded ? 'bg-gray-400 text-white cursor-not-allowed' :
                                       isAddingCurrentTag ? 'bg-gray-300 text-gray-700 cursor-not-allowed' :
                                       'bg-[#FFF9F9] text-[#AF204E] hover:bg-gray-200'}`}
                        >
                          {isAddingCurrentTag ? 'Adicionando...' : isTagAlreadyAdded ? 'Adicionada' : 'Adicionar'}
                          {isTagAlreadyAdded && <FaCheck className="inline-block ml-2" />}
                          {!isTagAlreadyAdded && !isAddingCurrentTag && <FaPlus className="inline-block ml-2" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[#0F1108] text-lg text-center mt-10">
                  Nenhuma tag disponível para adicionar.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistPage;
