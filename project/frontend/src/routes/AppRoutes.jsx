import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 

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
import PlaylistsFromUser from '../pages/PlaylistsFromUser.jsx'; 

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

      {/* Rotas do perfil logado */}
      <Route path="/liked-playlists" element={<LikedPlaylistsPage />} />
      <Route path="/my-playlists" element={<MyPlaylistsPage />} />
      <Route path="/profile" element={<ProfilePage />} /> 

      {/* Rotas com Parâmetros Dinâmicos */}
      <Route path="/users/:userId" element={<UserProfilePage />} /> 
      <Route path="/playlist/:playlistId" element={<PlaylistPage />} /> \
      <Route path="/playlists-from/:id" element={<PlaylistsFromUser />} />

      {/* Rota 404 (página real do 404) */}
      <Route path="/404" element={<NotFoundPage />} />

      {/* Catch-all para qualquer caminho não definido: REDIRECIONA para /404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRoutes;
