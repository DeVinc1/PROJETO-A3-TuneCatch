import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import Sidebar from './components/Sidebar.jsx';
import SearchBar from './components/SearchBar.jsx';
import UserBar from './components/userBar.jsx';
import TopBackground from './components/TopBackground.jsx'; // Importe o novo componente

function App() {
  const location = useLocation();

  // Rotas onde os elementos fixos (sidebar, searchbar, userbar, top background) NÃO devem aparecer
  const noFixedElementsRoutes = ['/login', '/register', '/404'];
  const shouldShowFixedElements = !noFixedElementsRoutes.some(route =>
    location.pathname.startsWith(route)
  ) && location.pathname !== '*';

  // Definições de dimensões para cálculo de paddings
  const sidebarWidth = '271px'; // Largura da sidebar
  const searchBarHeight = '80px'; // Altura estimada da SearchBar (h-12 + padding)
  const userBarWidthEstimate = '300px'; // Ainda usado para o 'right' da SearchBar, não para o padding do main
  const topBgHeight = '100px';

  return (
    <div className="App flex min-h-screen bg-[#FFF9F9] relative">
      {/* Top Background Fixo */}
      {shouldShowFixedElements && <TopBackground height={topBgHeight} />}

      {/* Sidebar Fixa */}
      {shouldShowFixedElements && <Sidebar />}

      {/* UserBar Fixa */}
      {shouldShowFixedElements && <UserBar />}

      {/* SearchBar Fixa - Posicionada entre a sidebar e a userbar */}
      {shouldShowFixedElements && (
        <div
          className="fixed top-4 z-10" // z-10 para ficar acima do background, mas abaixo da UserBar se for o caso
          style={{
            left: `calc(${sidebarWidth} + 32px)`, // 32px de padding padrão para o conteúdo principal
            right: `calc(${userBarWidthEstimate} + 32px)`, // O espaço à direita da SearchBar ainda respeita a UserBar
            height: searchBarHeight, // Define a altura do container fixo da SearchBar
          }}
        >
          <SearchBar /> {/* A SearchBar em si preenche 100% deste container fixo */}
        </div>
      )}

      {/*
        Área de Conteúdo Principal (main):
        Agora ela terá um padding direito menor ou nulo, permitindo que o conteúdo se estenda.
      */}
      <main
        className={`flex-grow flex flex-col`} // Sempre flex-grow para ocupar o resto do espaço
        style={{
          // Paddings para compensar elementos fixos
          paddingLeft: shouldShowFixedElements ? `calc(${sidebarWidth} + 32px)` : '0px',
          paddingTop: shouldShowFixedElements ? topBgHeight : '0px',
          // REMOVIDO o paddingRight que usava userBarWidthEstimate.
          // Agora, o paddingRight será apenas o padrão ou zero, permitindo que o conteúdo
          // se estenda para debaixo da UserBar.
          paddingRight: shouldShowFixedElements ? '32px' : '0px', // Um padding padrão para a direita se houver elementos fixos
          paddingBottom: shouldShowFixedElements ? '32px' : '0px', // Padding inferior padrão

          // Centralização para páginas como Login/Register/404 (quando não há elementos fixos)
          display: !shouldShowFixedElements ? 'flex' : undefined,
          alignItems: !shouldShowFixedElements ? 'center' : undefined,
          justifyContent: !shouldShowFixedElements ? 'center' : undefined,
          height: !shouldShowFixedElements ? '100%' : undefined, // Garante altura total para centralização
          width: !shouldShowFixedElements ? '100%' : undefined,   // Garante largura total para centralização
        }}
      >
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;