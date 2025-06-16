import React from 'react';
import { useLocation } from 'react-router-dom'; // Importe useLocation
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/Sidebar';

function App() {
  const location = useLocation(); // Hook para obter a localização atual

  // Defina as rotas onde a Sidebar NÃO deve aparecer
  const noSidebarRoutes = ['/login', '/register', '/404'];

  // Verifica se a rota atual está na lista de exclusão
  // Usamos .startsWith para pegar rotas como /login/algumparametro
  const shouldShowSidebar = !noSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  ) && location.pathname !== '*'; // Adiciona também a exclusão para a rota catch-all

  // A classe ml-[271px] compensa a nova largura da sidebar
  const mainContentClass = shouldShowSidebar ? 'ml-[271px]' : ''; // Aplica margem apenas se a sidebar for exibida

  return (
    <div className="App flex">
      {shouldShowSidebar && <Sidebar />} {/* Renderiza Sidebar condicionalmente */}
      <main className={`flex-grow ${mainContentClass}`}>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;