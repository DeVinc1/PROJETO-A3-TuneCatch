import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userApi } from '../services/api.js';

function UserBar() {
  const { userLoggedId, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const userBarRef = useRef(null); // Ref para a div principal da UserBar, para medir sua posição

  useEffect(() => {
    if (isAuthenticated && userLoggedId) {
      const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await userApi.get(`/${userLoggedId}`);
          setUserData(response.data);
        } catch (err) {
          console.error('Erro ao buscar dados do usuário:', err);
          setError('Não foi possível carregar os dados do usuário.');
          setUserData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      setUserData(null);
      setLoading(false);
      setError(null);
    }
  }, [userLoggedId, isAuthenticated]);

  // Efeito para fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verifica se o clique não foi dentro da UserBar principal (incluindo o botão da imagem)
      // nem dentro do próprio menu dropdown
      if (userBarRef.current && !userBarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Sem dependências para garantir que o listener seja configurado uma vez

  const handleProfileImageClick = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleMyProfileClick = () => {
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    logout();
  };

  if (!isAuthenticated || !userData) {
    if (loading) {
        return (
            <div className="fixed top-4 right-4 flex items-center bg-[#FFF9F9] p-2 rounded-full shadow-md z-20">
                <p className="text-[#0F1108] text-sm">Carregando...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="fixed top-4 right-4 flex items-center bg-[#FFF9F9] p-2 rounded-full shadow-md z-20">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }
    return null;
  }

  // Calcula a posição do dropdown com base na posição da UserBar principal
  let dropdownTop = 'calc(16px + 64px + 12px + 8px)'; // top-4 (16px) + h-16 (64px) + p-3 (12px) + mt-2 (8px)
                                                     // Isso é uma estimativa; o ideal é usar getBoundingClientRect()
  if (userBarRef.current) {
    const rect = userBarRef.current.getBoundingClientRect();
    // Início do dropdown = (fundo da UserBar + um pequeno gap)
    dropdownTop = `${rect.bottom + 8}px`; // rect.bottom é a distância do topo do viewport até o final da UserBar
  }


  return (
    // Removido 'relative' do container principal, pois o dropdown será 'fixed' também
    // E adicionado o ref para medir sua posição
    <div ref={userBarRef} className="fixed top-4 right-4 flex items-center bg-[#FFF9F9] p-3 rounded-full z-20">
      <p className="text-[#0F1108] text-lg mr-3 flex-shrink-0">
       <p> Olá, </p> 
       <span className="font-bold">{userData.username}</span>.
      </p>
      <button
        onClick={handleProfileImageClick}
        className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#AF204E] flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50"
        aria-label="Abrir menu do perfil"
      >
        <img
          src={userData.avatarURL || 'https://via.placeholder.co/64'}
          alt={`${userData.username}'s profile`}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Menu Dropdown - Agora é fixed e posicionado dinamicamente */}
      {isMenuOpen && (
        <div
          // Não precisa mais de ref aqui, o userBarRef já lida com o clique fora
          className="fixed w-48 bg-[#FFF9F9] rounded-lg shadow-xl z-30 overflow-hidden" // Z-index maior
          style={{
            top: dropdownTop, // Posição calculada dinamicamente
            right: '16px',    // Alinha à direita, igual ao top-4 da UserBar principal
          }}
        >
          <button
            onClick={handleMyProfileClick}
            className="block w-full text-left px-4 py-2 text-[#0F1108] text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Meu perfil
          </button>
          <button
            onClick={handleLogoutClick}
            className="block w-full text-left px-4 py-2 text-red-600 font-semibold text-lg hover:bg-red-100 transition-colors duration-200"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default UserBar;