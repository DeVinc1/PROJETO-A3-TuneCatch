import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisH, FaPencilAlt, FaArrowRight, FaUser, FaEnvelope, FaLock, FaImage, FaUserCircle } from 'react-icons/fa'; // Importar todos os ícones necessários
import { userApi } from '../services/api.js'; // API para buscar dados do usuário
import { useAuth } from '../contexts/AuthContext.jsx'; // Contexto de autenticação

function ProfilePage() {
  const { userLoggedId, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);
  const [hoveredBadgeId, setHoveredBadgeId] = useState(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false); // Estado para o modal de edição

  // Estados para o formulário de edição
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editAvatarURL, setEditAvatarURL] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // Senha atual é sempre necessária para a API
  const [editFormError, setEditFormError] = useState(null);
  const [editFormSuccess, setEditFormSuccess] = useState(null);


  const navigate = useNavigate();
  const menuButtonRef = useRef(null); // Ref para o botão de 3 pontinhos
  const deleteMenuRef = useRef(null); // Ref para o div do menu dropdown de exclusão

  // Função para buscar dados do perfil (refatorada para ser reutilizável)
  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.get(`/${userLoggedId}`);
      setUserData(response.data);
      // Pré-popular os campos do formulário de edição ao carregar os dados
      setEditUsername(response.data.username || '');
      setEditEmail(response.data.email || '');
      setEditDisplayName(response.data.displayName || '');
      setEditAvatarURL(response.data.avatarURL || '');
    } catch (err) {
      console.error("Erro ao buscar dados do perfil:", err);
      setError("Não foi possível carregar seu perfil. Tente novamente mais tarde.");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (userLoggedId) {
      fetchProfileData();
    } else {
      setLoading(true);
    }
  }, [userLoggedId, isAuthenticated, navigate]);

  // Efeito para fechar o menu de 3 pontinhos ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o clique foi no botão de 3 pontinhos, ou dentro do próprio menu de exclusão, não fecha
      if (menuButtonRef.current && menuButtonRef.current.contains(event.target)) {
        return;
      }
      if (deleteMenuRef.current && deleteMenuRef.current.contains(event.target)) {
        return;
      }
      // Se o modal de confirmação ou edição está aberto, não fecha o menu de 3 pontinhos
      if (showConfirmDeleteModal || showEditProfileModal) {
        return;
      }
      // Caso contrário, fecha o menu de 3 pontinhos
      setIsDeleteMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConfirmDeleteModal, showEditProfileModal]); // Adiciona dependências para reavaliar o listener


  // --- Funções de Ação ---

  const handleEditProfileClick = () => {
    setShowEditProfileModal(true); // Abre o modal de edição
    setEditFormError(null); // Limpa erros anteriores
    setEditFormSuccess(null); // Limpa mensagens de sucesso anteriores
    setCurrentPassword(''); // Garante que a senha atual seja reiniciada
  };

  const handleCloseEditModal = () => {
    setShowEditProfileModal(false); // Fecha o modal de edição
    setEditFormError(null);
    setEditFormSuccess(null);
    setCurrentPassword(''); // Limpa a senha atual ao fechar
  };

  const handleSubmitEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa loading global
    setEditFormError(null);
    setEditFormSuccess(null);

    const payload = {
      currentPassword: currentPassword, // Senha atual é OBRIGATÓRIA para a API
      username: editUsername,
      email: editEmail,
      displayName: editDisplayName,
      avatarURL: editAvatarURL,
    };

    try {
      // Endpoint: PUT http://localhost:2100/maestro/usuario/{id_logado}/detalhes
      const response = await userApi.put(`/${userLoggedId}/detalhes`, payload);
      console.log("Perfil atualizado com sucesso:", response.data);
      setEditFormSuccess("Perfil atualizado com sucesso!");

      // Re-fetch dos dados do perfil para atualizar a UI
      await fetchProfileData();

      // Opcional: fechar o modal após um pequeno atraso para o usuário ver a mensagem de sucesso
      setTimeout(() => {
        setShowEditProfileModal(false);
        setCurrentPassword(''); // Limpa a senha após o sucesso
      }, 1500);

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      const errorMessage = err.response?.data?.message || "Erro ao atualizar perfil. Verifique seus dados e senha.";
      setEditFormError(errorMessage);
    } finally {
      setLoading(false); // Desativa loading global
    }
  };

  const handleToggleDeleteMenu = () => {
    setIsDeleteMenuOpen(prev => !prev);
  };

  const handleDeleteAccountConfirmation = (e) => {
    e.stopPropagation(); // Impede que o clique se propague para o documento e feche o menu/modal
    console.log("handleDeleteAccountConfirmation called. Opening modal.");
    setIsDeleteMenuOpen(false); // Fecha o menu de 3 pontinhos imediatamente
    setShowConfirmDeleteModal(true); // Abre o modal de confirmação
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setShowConfirmDeleteModal(false); // Fecha o modal de confirmação
    try {
      await userApi.delete(`/${userLoggedId}`);
      console.log("Conta deletada com sucesso!");
      logout(); // Chama a função de logout do contexto
      navigate('/login'); // Redireciona para a página de login
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      setError("Não foi possível deletar sua conta. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    console.log("Cancel delete clicked. Closing modal.");
    setShowConfirmDeleteModal(false); // Fecha o modal de confirmação
  };

  const handleClickPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleClickUser = (userId) => {
    navigate(`/users/${userId}`); // Redireciona para a página de perfil de outro usuário
  };

  // --- Renderização Condicional (Loading, Error, No Data) ---

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-[#0F1108] text-lg">Carregando perfil...</p>
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

  if (!userData) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-[#0F1108] text-lg">Nenhum dado de perfil encontrado. Faça login para ver seu perfil.</p>
      </div>
    );
  }

  // Calcula a posição do menu de exclusão (dropdown) dinamicamente
  let deleteMenuTop = '0px';
  let deleteMenuRight = '0px';
  if (menuButtonRef.current) {
    const rect = menuButtonRef.current.getBoundingClientRect();
    deleteMenuTop = `${rect.bottom + 8}px`; // Abaixo do botão de 3 pontinhos + 8px (mt-2)
    deleteMenuRight = `${window.innerWidth - rect.right}px`; // Alinhado à direita com o botão
  }

  return (
    <div className="p-8">
      {/* Topo do Perfil */}
      <div className="flex items-start mb-10">
        {/* Imagem de Perfil Grande */}
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#AF204E] flex-shrink-0">
          <img
            src={userData.avatarURL || 'https://placehold.co/256x256/E0E0E0/787878?text=Sem+Avatar'}
            alt={`${userData.username}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info do Perfil (nome, seguidores, botões) */}
        <div className="ml-12 flex-grow">
          <p className="text-[#0F1108] text-lg italic font-normal">Perfil</p>
          <h1 className="text-5xl font-bold text-[#0F1108] mt-1">@{userData.username}</h1>
          {userData.displayName && (
            <p className="text-[#0F1108] text-xl italic font-normal mt-4">
              - {userData.displayName}
            </p>
          )}

          {/* Seção de Badges */}
          {userData.userBadges && userData.userBadges.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {userData.userBadges.map(badge => (
                <div
                  key={badge.id}
                  className="relative flex items-center px-4 py-2 rounded-xl shadow-md text-[#FFF3F3] text-base font-semibold"
                  style={{
                    background: 'linear-gradient(to right, #926E2D, #C6B069, #926E2D)',
                  }}
                  onMouseEnter={() => setHoveredBadgeId(badge.id)}
                  onMouseLeave={() => setHoveredBadgeId(null)}
                >
                  {badge.iconURL && badge.iconURL.startsWith('http') ? (
                    <img src={badge.iconURL} alt={badge.name} className="w-6 h-6 mr-2 object-contain" />
                  ) : (
                    <span className="text-2xl mr-2">{badge.iconURL}</span>
                  )}
                  <span>{badge.name}</span>

                  {hoveredBadgeId === badge.id && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-40">
                      {badge.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contagem de Seguidores, Seguindo E Botões de Ação */}
          <div className="flex items-center space-x-6 mt-6 text-[#0F1108] w-full">
            <div className="flex space-x-6">
              <p className="text-xl">
                <span className="font-normal">{userData.followers?.length || 0}</span> <span className="font-bold">Seguidores</span>
              </p>
              <p className="text-xl">
                <span className="font-normal">{userData.following?.length || 0}</span> <span className="font-bold">Seguindo</span>
              </p>
            </div>

            <div className="flex items-center space-x-4 ml-auto relative">
              <button
                onClick={handleEditProfileClick} // Alterado para a nova função do modal de edição
                className="flex items-center bg-[#AF204E] text-[#FFF3F3] font-bold py-2 px-8 rounded-full
                                    border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                                    focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                                    hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]"
              >
                <FaPencilAlt className="mr-2" />
                Editar seu perfil
              </button>

              <button
                onClick={handleToggleDeleteMenu}
                className="w-12 h-12 rounded-full border-2 border-[#0F1108] flex items-center justify-center text-[#0F1108] text-2xl focus:outline-none focus:ring-2 focus:ring-[#0F1108]/50"
                ref={menuButtonRef}
                aria-label="Opções do perfil"
              >
                <FaEllipsisH />
              </button>

              {/* Menu Dropdown de Exclusão de Conta */}
              {isDeleteMenuOpen && (
                <div
                  ref={deleteMenuRef} // Atribui o ref aqui
                  className="fixed w-48 bg-[#FFF9F9] rounded-lg shadow-xl z-40 overflow-hidden"
                  style={{ top: deleteMenuTop, right: deleteMenuRight }}
                >
                  <button
                    onClick={handleDeleteAccountConfirmation}
                    className="block w-full text-left px-4 py-2 text-red-600 font-semibold text-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    Excluir conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="my-10 border-t border-gray-300" />

      {/* Seção de Playlists Criadas */}
      <h3 className="text-2xl font-normal text-[#0F1108] mb-6">Playlists que você assinou embaixo</h3>
      <div className="relative mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start">
          {userData.createdPlaylists && userData.createdPlaylists.length > 0 ? (
            userData.createdPlaylists.slice(0, 7).map((playlist) => ( // Exibe 7 playlists
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
            <p className="text-[#0F1108] text-lg col-span-full">Você ainda não criou nenhuma playlist... 😢</p>
          )}
        </div>

        {/* Círculo com seta para "Minhas Playlists" - Apenas se houver playlists */}
        {userData.createdPlaylists && userData.createdPlaylists.length > 0 && (
          <button
            onClick={() => navigate('/my-playlists')}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#E67A9D] flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#E67A9D]/50"
            aria-label="Ver todas as minhas playlists"
          >
            <FaArrowRight className="text-[#FFF9F9] text-xl" />
          </button>
        )}
      </div>

      {/* Nova Seção: Seguidores */}
      <h3 className="text-2xl font-normal text-[#0F1108] mb-6">Pessoas que gostam do que você faz!</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start">
        {userData.followers && userData.followers.length > 0 ? (
          userData.followers.map((follower) => (
            <button
              key={follower.id}
              onClick={() => handleClickUser(follower.id)}
              className="flex flex-col items-start text-left w-48 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-48 h-48 overflow-hidden rounded-full mb-2 shadow-md border-4 border-[#AF204E]">
                <img
                  src={follower.avatarURL || 'https://placehold.co/192x192/E0E0E0/787878?text=Sem+Avatar'}
                  alt={follower.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[#0F1108] font-normal text-lg truncate w-full">@{follower.username}</p>
            </button>
          ))
        ) : (
          <p className="text-[#0F1108] text-lg col-span-full">Você ainda não tem nenhum seguidor.</p>
        )}
      </div>


      {/* Modal de Confirmação de Exclusão */}
      {showConfirmDeleteModal && (
        <div id="delete-confirm-modal" className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#FFF3F3] p-8 rounded-lg shadow-2xl border-2 border-[#FF9F99] text-center w-80">
            <p className="text-[#0F1108] text-xl font-semibold mb-6">
              Você tem certeza que quer deixar o TuneCatch 😢
            </p>
            <div className="flex justify-around space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition duration-300"
              >
                Sim
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-[#0F1108] font-bold py-2 px-6 rounded-full hover:bg-gray-400 transition duration-300"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Perfil */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#FFF3F3] p-8 rounded-lg shadow-2xl border-2 border-[#AF204E] text-center w-full max-w-lg">
            <h2 className="text-3xl font-bold text-[#0F1108] mb-6">Editar Perfil</h2>

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

            <form onSubmit={handleSubmitEditProfile}>
              {/* Campos do Formulário */}
              <div className="mb-4">
                <label htmlFor="editUsername" className="block text-[#0F1108] text-sm font-semibold mb-2 text-left">Nome de Usuário:</label>
                <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <FaUser className="text-[#AF204E] ml-4 mr-2" size={20} />
                  <input
                    type="text"
                    id="editUsername"
                    className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="editEmail" className="block text-[#0F1108] text-sm font-semibold mb-2 text-left">Email:</label>
                <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <FaEnvelope className="text-[#AF204E] ml-4 mr-2" size={20} />
                  <input
                    type="email"
                    id="editEmail"
                    className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="editDisplayName" className="block text-[#0F1108] text-sm font-semibold mb-2 text-left">Nome de Exibição:</label>
                <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <FaUserCircle className="text-[#AF204E] ml-4 mr-2" size={20} />
                  <input
                    type="text"
                    id="editDisplayName"
                    className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="editAvatarURL" className="block text-[#0F1108] text-sm font-semibold mb-2 text-left">URL do Avatar:</label>
                <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <FaImage className="text-[#AF204E] ml-4 mr-2" size={20} />
                  <input
                    type="url"
                    id="editAvatarURL"
                    className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                    value={editAvatarURL}
                    onChange={(e) => setEditAvatarURL(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="currentPassword" className="block text-[#0F1108] text-sm font-semibold mb-2 text-left">Senha Atual (obrigatório para salvar):</label>
                <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <FaLock className="text-[#AF204E] ml-4 mr-2" size={20} />
                  <input
                    type="password"
                    id="currentPassword"
                    className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                    placeholder="Sua senha atual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-around space-x-4 mt-6">
                <button
                  type="submit"
                  className={`bg-[#AF204E] text-[#FFF3F3] font-bold py-2 px-8 rounded-full
                                        border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                                        focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                                        ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]'}`}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="bg-gray-300 text-[#0F1108] font-bold py-2 px-8 rounded-full
                                        hover:bg-gray-400 transition duration-300"
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;