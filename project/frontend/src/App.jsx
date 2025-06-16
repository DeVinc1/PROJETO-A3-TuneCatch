import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar'; // Importe o componente SearchBar

function App() {
  const location = useLocation();

  const noSidebarRoutes = ['/login', '/register', '/404'];
  const shouldShowSidebar = !noSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  ) && location.pathname !== '*';

  // A margem principal agora é aplicada ao container do conteúdo para alinhar com a sidebar
  const mainContainerClass = shouldShowSidebar ? 'ml-[271px]' : '';

  return (
    <div className="App flex min-h-screen bg-[#FFF9F9]"> {/* Adicione min-h-screen e bg-FFF9F9 aqui */}
      {shouldShowSidebar && <Sidebar />}

      {/* O conteúdo principal, agora com a SearchBar no topo */}
      <div className={`flex-grow flex flex-col p-8 ${mainContainerClass}`}> {/* Adiciona padding e flex-col para organizar */}
        {shouldShowSidebar && <SearchBar />} {/* Renderiza SearchBar condicionalmente junto com a Sidebar */}

        <main className="flex-grow pt-4"> {/* Adiciona um padding-top para separar da SearchBar */}
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;