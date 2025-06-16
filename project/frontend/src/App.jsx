import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import Sidebar from './components/Sidebar.jsx';
import SearchBar from './components/SearchBar.jsx';
import UserBar from './components/UserBar.jsx';
import TopBackground from './components/TopBackground.jsx';
import SpotifyEmbedPlayer from './components/SpotifyEmbedPlayer.jsx'; // NOVO: Importe o player de embed
import { PlayerProvider } from './contexts/PlayerContext.jsx'; // NOVO: Importe o PlayerProvider

function App() {
  const location = useLocation();

  const noFixedElementsRoutes = ['/login', '/register', '/404'];
  const shouldShowFixedElements = !noFixedElementsRoutes.some(route =>
    location.pathname.startsWith(route)
  ) && location.pathname !== '*';

  const sidebarWidth = '271px';
  const searchBarHeight = '80px';
  const userBarWidthEstimate = '300px';
  const topBgHeight = '100px';
  const playerHeight = '80px'; // Altura do player fixo na parte inferior

  return (
    <div className="App flex min-h-screen bg-[#FFF9F9] relative">
      <PlayerProvider> {/* Envolve toda a aplicação que precisa do player */}
        {/* Top Background Fixo */}
        {shouldShowFixedElements && <TopBackground height={topBgHeight} className="z-30" />}

        {/* Sidebar Fixa */}
        {shouldShowFixedElements && <Sidebar className="z-30" />}

        {/* UserBar Fixa */}
        {shouldShowFixedElements && <UserBar className="z-30" />}

        {/* SearchBar Fixa */}
        {shouldShowFixedElements && (
          <div
            className="fixed top-4 z-30"
            style={{
              left: `calc(${sidebarWidth} + 32px)`,
              right: `calc(${userBarWidthEstimate} + 32px)`,
              height: searchBarHeight,
            }}
          >
            <SearchBar />
          </div>
        )}

        <main
          className={`flex-grow flex flex-col`}
          style={{
            paddingLeft: shouldShowFixedElements ? `calc(${sidebarWidth} + 32px)` : '0px',
            paddingTop: shouldShowFixedElements ? topBgHeight : '0px',
            paddingRight: shouldShowFixedElements ? '32px' : '0px',
            // NOVO: Padding inferior para o player de embed
            paddingBottom: shouldShowFixedElements ? playerHeight : '0px',

            display: !shouldShowFixedElements ? 'flex' : undefined,
            alignItems: !shouldShowFixedElements ? 'center' : undefined,
            justifyContent: !shouldShowFixedElements ? 'center' : undefined,
            height: !shouldShowFixedElements ? '100%' : undefined,
            width: !shouldShowFixedElements ? '100%' : undefined,
          }}
        >
          <AppRoutes />
        </main>

        {/* Spotify Embed Player Fixo na parte inferior */}
        {shouldShowFixedElements && <SpotifyEmbedPlayer />}
      </PlayerProvider>
    </div>
  );
}

export default App;
