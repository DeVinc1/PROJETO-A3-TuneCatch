import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import Sidebar from './components/Sidebar.jsx';
import SearchBar from './components/SearchBar.jsx';
import UserBar from './components/userBar.jsx';

function App() {
  const location = useLocation();

  const noHeaderAndSidebarRoutes = ['/login', '/register', '/404'];
  const shouldShowHeaderAndSidebar = !noHeaderAndSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  ) && location.pathname !== '*';

  const mainContainerClass = shouldShowHeaderAndSidebar ? 'ml-[271px]' : '';

  return (
    <div className="App flex min-h-screen bg-[#FFF9F9] relative">
      {shouldShowHeaderAndSidebar && <Sidebar />}

      <div className={`flex-grow flex flex-col p-8 ${mainContainerClass}`}>
        {shouldShowHeaderAndSidebar && <SearchBar />}
        {/*
          Aqui, o 'main' agora terá classes condicionais:
          - 'flex-grow' para ocupar o espaço restante.
          - Se a sidebar/searchbar NÃO estiverem visíveis:
            - 'flex items-center justify-center': para centralizar o conteúdo.
            - 'h-full': para garantir que o 'main' ocupe a altura total do seu pai, permitindo a centralização.
          - Se a sidebar/searchbar ESTIVEREM visíveis:
            - 'pt-4': para dar um espaçamento superior da SearchBar.
        */}
        <main className={`flex-grow ${shouldShowHeaderAndSidebar ? 'pt-4' : 'flex items-center justify-center h-full'}`}>
          <AppRoutes />
        </main>
      </div>

      {shouldShowHeaderAndSidebar && <UserBar />}
    </div>
  );
}

export default App;