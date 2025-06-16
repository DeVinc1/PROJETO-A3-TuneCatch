import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import Sidebar from './components/Sidebar.jsx';
import SearchBar from './components/SearchBar.jsx';
import UserBar from './components/userBar.jsx';
import TopBackground from './components/TopBackground.jsx'; 

function App() {
  const location = useLocation();

 
  const noFixedElementsRoutes = ['/login', '/register', '/404'];
  const shouldShowFixedElements = !noFixedElementsRoutes.some(route =>
    location.pathname.startsWith(route)
  ) && location.pathname !== '*';

  const sidebarWidth = '271px'; // Largura da sidebar
  const searchBarHeight = '80px'; // Altura estimada da SearchBar (h-12 + padding)
  const userBarWidthEstimate = '200px'; // Estimativa da largura da UserBar para espaçamento


  const topBgHeight = '100px'; 

  return (
    <div className="App flex min-h-screen bg-[#FFF9F9] relative">
      {/* Top Background Fixo - Renderizado aqui, logo no início do App */}
      {shouldShowFixedElements && <TopBackground height={topBgHeight} />}

      {/* Sidebar Fixa */}
      {shouldShowFixedElements && <Sidebar />}

      {/* UserBar Fixa */}
      {shouldShowFixedElements && <UserBar />}

      {/* SearchBar Fixa - Posicionada entre a sidebar e a userbar */}
      {shouldShowFixedElements && (
        <div
          className="fixed top-4 z-10"
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
          paddingTop: shouldShowFixedElements ? topBgHeight : '0px', // Usando topBgHeight para o padding superior
          paddingRight: shouldShowFixedElements ? `calc(${userBarWidthEstimate} + 32px)` : '0px',
          paddingBottom: shouldShowFixedElements ? '32px' : '0px',

          display: !shouldShowFixedElements ? 'flex' : undefined,
          alignItems: !shouldShowFixedElements ? 'center' : undefined,
          justifyContent: !shouldShowFixedElements ? 'center' : undefined,
          height: !shouldShowFixedElements ? '100%' : undefined,
          width: !shouldShowFixedElements ? '100%' : undefined,
        }}
      >
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;