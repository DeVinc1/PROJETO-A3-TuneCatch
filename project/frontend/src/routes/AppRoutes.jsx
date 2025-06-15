import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ExplorePage from '../pages/ExplorePage.jsx';
import LikedPlaylistsPage from '../pages/LikedPlaylistsPage.jsx';
import MyPlaylistsPage from '../pages/MyPlaylistsPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx'; 
import UserProfilePage from '../pages/UserProfilePage.jsx'; 
import PlaylistPage from '../pages/PlaylistPage.jsx'; 

import GeneralSearchPage from '../pages/GeneralSearchPage.jsx';      
import SearchByTagPage from '../pages/SearchByTagPage.jsx';          
import SearchByUsernamePage from '../pages/SearchByUsernamePage.jsx'; 
import SearchByPlaylistNamePage from '../pages/SearchByPlaylistNamePage.jsx';
import SearchTracksInPlaylistPage from '../pages/SearchTracksInPlaylistPage.jsx'; 

import NotFoundPage from '../pages/NotFoundPage.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/explore" element={<ExplorePage />} />

      {/* Rotas de Pesquisa Detalhadas */}
      <Route path="/search" element={<GeneralSearchPage />} /> 
      <Route path="/search/tags/:tagQuery?" element={<SearchByTagPage />} />
      <Route path="/search/users/:usernameQuery?" element={<SearchByUsernamePage />} /> 
      <Route path="/search/playlists/:playlistNameQuery?" element={<SearchByPlaylistNamePage />} /> 

      {/* Rotas do perfil logado */}
      <Route path="/liked-playlists" element={<LikedPlaylistsPage />} />
      <Route path="/my-playlists" element={<MyPlaylistsPage />} />
      <Route path="/profile" element={<ProfilePage />} /> 

      {/* Rotas com Parâmetros Dinâmicos */}
      <Route path="/users/:userId" element={<UserProfilePage />} /> 
      <Route path="/playlist/:playlistId" element={<PlaylistPage />} /> \

      {/* Rota para buscar playlists que possuam uma música */}
      <Route path="/playlist/search-tracks/:trackName" element={<SearchTracksInPlaylistPage />} />

      {/* Rota 404 (catch-all para qualquer caminho não definido) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
