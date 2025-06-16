import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import { userApi } from '../services/api.js'; 

function UserBar() {
  const { userLoggedId, isAuthenticated } = useAuth(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  D
    if (isAuthenticated && userLoggedId) {
      const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Endpoint: http://localhost:2100/maestro/usuario/{id_user_logado}
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

  if (!isAuthenticated || !userData) {

    if (loading) {
        return (
            <div className="absolute top-4 right-4 flex items-center bg-[#FFF9F9] p-2 rounded-full shadow-md">
                <p className="text-[#0F1108] text-sm">Carregando...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="absolute top-4 right-4 flex items-center bg-[#FFF9F9] p-2 rounded-full shadow-md">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }
    return null; 
  }

  return (

    <div className="absolute top-4 right-4 flex items-center bg-[#FFF9F9] p-3 rounded-full z-10">
      {/* Texto de saudação */}
      <p className="text-[#0F1108] text-lg mr-3 flex-shrink-0">
        <p>Olá,</p>
         <span className="font-bold">{userData.username}</span>.
      </p>

      
      <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-[#AF204E] flex-shrink-0">
        <img
          src={userData.avatarURL} 
          alt={`${userData.username}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default UserBar;