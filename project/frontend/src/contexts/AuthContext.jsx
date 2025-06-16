import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userLoggedId, setUserLoggedId] = useState(() => {
    const storedId = localStorage.getItem('idUserLogged');
    return storedId ? parseInt(storedId, 10) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Função de login
  const login = useCallback(async (credential, password) => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint completo: http://localhost:2100/maestro/usuario/fazer-login
      console.log('Tentando login com:', { credential, password }); // DEBUG: Payload enviado
      console.log('Chamando endpoint:', userApi.defaults.baseURL + '/fazer-login'); // DEBUG: URL completa
      const response = await userApi.post('/fazer-login', { credential, password });

      console.log('Resposta da API (sucesso):', response.data); // DEBUG: Resposta completa da API

      const { idUserLogged, message } = response.data;

      if (idUserLogged) {
        setUserLoggedId(idUserLogged);
        localStorage.setItem('idUserLogged', idUserLogged.toString());
        console.log(message); // "Login realizado com sucesso."
        return { success: true, message: message };
      } else {
        setError(message || 'Erro inesperado no login.');
        return { success: false, message: message || 'Erro inesperado no login.' };
      }
    } catch (err) {
      console.error('Erro de autenticação (detalhes):', err); // DEBUG: O erro completo
      console.error('Erro de resposta da API (se houver):', err.response); // DEBUG: Detalhes da resposta de erro (status, data)
      console.error('Mensagem de erro do Axios:', err.message); // DEBUG: Mensagem do Axios

      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Função de logout
  const logout = useCallback(() => {
    setUserLoggedId(null);
    localStorage.removeItem('idUserLogged');
    navigate('/login');
  }, [navigate]);

  const authContextValue = {
    userLoggedId,
    isAuthenticated: !!userLoggedId,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};