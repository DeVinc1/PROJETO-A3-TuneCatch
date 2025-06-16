import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext.jsx';

function LoginPage() {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const result = await login(credential, password);

      if (result.success) {
        navigate('/');
      } else {
        setFormError(result.message || 'Credenciais inválidas.');
      }
    } catch (err) {
      console.error("Erro inesperado no handleSubmit da LoginPage:", err);
      setFormError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Removido 'min-h-screen' daqui. O 'main' em App.jsx já gerencia a altura da tela.
    <div className="flex flex-col items-center justify-center bg-[#FFF9F9] p-4 font-poppins">
      <div
        className="bg-[#FFF3F3] p-10 rounded-lg shadow-xl w-full max-w-lg border-2 border-[#AF204E]"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <h2 className="text-4xl font-bold text-center text-[#0F1108] mb-4">
          Bem-Vindo ao TuneCatch
        </h2>
        <p className="text-center text-[#0F1108] mb-8 text-lg">
          Faça o login e vem escutar músicas com centenas de outras pessoas!
        </p>

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline ml-2">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="credential" className="block text-[#0F1108] text-sm font-semibold mb-2">
              Email ou Nome de Usuário:
            </label>
            <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaUser className="text-[#AF204E] ml-4 mr-2" size={20} />
              <input
                type="text"
                id="credential"
                className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                placeholder="Seu email ou nome de usuário"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-[#0F1108] text-sm font-semibold mb-2">
              Senha:
            </label>
            <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaLock className="text-[#AF204E] ml-4 mr-2" size={20} />
              <input
                type="password"
                id="password"
                className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                placeholder="*************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-center flex-col">
            <button
              type="submit"
              className={`w-full bg-[#AF204E] text-[#FFF9F9] font-bold py-4 px-10 rounded-full focus:outline-none focus:shadow-outline
              border-2 border-[#FFF9F9] shadow-[0px_0px_0px_3px_#AF204E]
              transition duration-300 ease-in-out ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-800'}`}
              disabled={loading}
            >
              {loading ? 'Fazendo Login...' : 'Fazer Login'}
            </button>
            <p className="inline-block align-baseline mt-4 text-[#0F1108] text-base">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="font-bold text-[#AF204E] hover:text-red-800 transition duration-300"
              >
                Cadastre-se agora!
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;