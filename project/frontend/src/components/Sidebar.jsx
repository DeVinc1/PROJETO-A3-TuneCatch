import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaCompass,
  FaHeart,
  FaUser,
  FaArrowRight,
} from 'react-icons/fa'; // Ícones
import { playlistApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Importe useAuth
import logo from '../assets/Logo - Red.png';
import placeholderPlaylistImage from '../assets/placeholder-playlist.png'; 

function Sidebar() {
  // NOVO: Obtenha triggerSidebarPlaylistRefresh do useAuth
  const { userLoggedId, isAuthenticated, triggerSidebarPlaylistRefresh } = useAuth(); 
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [errorPlaylists, setErrorPlaylists] = useState(null);
  const location = useLocation();

  const mainMenuItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Explorar', icon: FaCompass, path: '/explore' },
    { name: 'Playlists Curtidas', icon: FaHeart, path: '/liked-playlists' },
    { name: 'Meu perfil', icon: FaUser, path: '/profile' },
  ];

  useEffect(() => {
    const fetchMyPlaylists = async () => {
      setLoadingPlaylists(true);
      setErrorPlaylists(null);
      if (isAuthenticated && userLoggedId) {
        try {
          const response = await playlistApi.get(`/usuario/${userLoggedId}`);
          const fetchedPlaylists = response.data.playlists
            ? response.data.playlists.map(p => ({
                id: p.id,
                name: p.name,
                coverImageURL: p.coverImageURL,
              })).slice(0, 5)
            : [];
          setPlaylists(fetchedPlaylists);
          setLoadingPlaylists(false);
        } catch (err) {
          console.error('Erro ao buscar playlists:', err);
          setErrorPlaylists('Não foi possível carregar suas playlists.');
          setLoadingPlaylists(false);
        }
      } else {
        setPlaylists([]);
        setLoadingPlaylists(false);
      }
    };

    // Este useEffect será disparado por:
    // - Mudanças no userLoggedId ou isAuthenticated (login/logout)
    // - Mudanças em location.pathname (navegação entre rotas)
    // - Mudanças em triggerSidebarPlaylistRefresh (sinal de atualização de playlists de outros componentes)
    fetchMyPlaylists();
  }, [userLoggedId, isAuthenticated, location.pathname, triggerSidebarPlaylistRefresh]); // ADICIONADO triggerSidebarPlaylistRefresh

  const noSidebarRoutes = ['/login', '/register', '/404']; 
  if (
    noSidebarRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/404') ||
    location.pathname === '*'
  ) {
    return null; 
  }

  const sidebarWidthClass = 'w-[271px]'; 

  return (
    <aside className={`${sidebarWidthClass} bg-[#FFF9F9] h-full flex flex-col p-4 border-r border-gray-200 shadow-lg fixed top-0 left-0`}>
      <div className="flex items-center mb-8 px-4 py-2">
        <img src={ logo } alt="TuneCatch Logo" className="h-[60px] w-auto mr-2" />
        <h1 className="text-2xl font-bold text-[#AF204E]">TuneCatch</h1>
      </div>

      {/* Menu Principal */}
      <nav className="flex-grow">
        <ul>
          {mainMenuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg text-lg transition-all duration-300
                  ${
                    isActive
                      ? 'text-[#AF204E] font-bold shadow-md shadow-[#AF204E]/30'
                      : 'text-[#0F1108] font-normal'
                  }
                  hover:text-[#AF204E] hover:font-bold hover:shadow-md hover:shadow-[#AF204E]/30
                  `
                }
              >
                <item.icon className="mr-3 text-xl" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Separador */}
        <hr className="my-6 border-t border-[#AF204E]/50" />

        {/* Minhas Playlists */}
        <h2 className="text-xl font-semibold text-[#AF204E] mb-4 px-4">Minhas Playlists</h2>
        {loadingPlaylists ? (
          <p className="text-gray-600 px-4">Carregando playlists...</p>
        ) : errorPlaylists ? (
          <p className="text-red-500 px-4">{errorPlaylists}</p>
        ) : playlists.length > 0 ? (
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id} className="mb-2">
                <NavLink
                  to={`/playlist/${playlist.id}`} 
                  className="flex items-center px-4 py-2 rounded-lg transition-all duration-300 text-[#0F1108]
                    hover:text-[#AF204E] hover:font-bold hover:shadow-md hover:shadow-[#AF204E]/30"
                >
                  <img
                    src={playlist.coverImageURL || placeholderPlaylistImage} 
                    alt={playlist.name}
                    className="w-16 h-16 rounded-md object-cover mr-3" 
                  />
                  <span className="text-md truncate">{playlist.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 px-4">Você ainda não criou nada... Que tal mudar isso?</p>
        )}

        {/* Ver Todas as Playlists */}
        <div className="mt-6 px-4">
          <NavLink
            to="/my-playlists"
            className="flex items-center justify-end text-[#AF204E] font-bold underline
              hover:text-[#AF204E] hover:no-underline transition-colors duration-300"
          >
            <span className="mr-2">Ver todas</span>
            <FaArrowRight className="text-lg" />
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;