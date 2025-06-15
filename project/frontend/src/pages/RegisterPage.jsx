import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaImage, FaUserCircle } from 'react-icons/fa'; 
import { userApi } from '../services/api'; 

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [avatarURL, setAvatarURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        username,
        email,
        password,
 
        ...(displayName && { displayName }),
        ...(avatarURL && { avatarURL }),
      };

      console.log('Tentando cadastrar com payload:', payload);
      console.log('Chamando endpoint:', userApi.defaults.baseURL); 

 
      const response = await userApi.post('/', payload);
      
      console.log('Cadastro bem-sucedido:', response.data);
      setSuccessMessage('Cadastro realizado com sucesso! Você já pode fazer login.');
      
     
      setUsername('');
      setEmail('');
      setDisplayName('');
      setPassword('');
      setAvatarURL('');

      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      console.error('Erro no cadastro:', err);
      if (err.response && err.response.data) {
        if (err.response.status === 409) {
          setFormError(err.response.data.details || 'Usuário ou email já em uso.');
        } else {
          setFormError(err.response.data.message || 'Erro ao cadastrar. Tente novamente.');
        }
      } else {
        setFormError('Erro ao cadastrar. Por favor, verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F9] p-4 font-poppins">
      <div
        className="bg-[#FFF3F3] p-10 rounded-lg shadow-xl w-full max-w-lg border-2 border-[#AF204E]"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <h2 className="text-4xl font-bold text-center text-[#0F1108] mb-4">
          Cadastre-se no TuneCatch
        </h2>
        <p className="text-center text-[#0F1108] mb-8 text-lg">
          Venha fazer parte de uma comunidade apaixonada por música!
        </p>

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline ml-2">{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
            <strong className="font-bold">Sucesso!</strong>
            <span className="block sm:inline ml-2">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4 relative">
            <label htmlFor="username" className="block text-[#0F1108] text-sm font-semibold mb-2">
              Nome de Usuário:
            </label>
            <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaUser className="text-[#AF204E] ml-4 mr-2" size={20} />
              <input
                type="text"
                id="username"
                className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                placeholder="Seu nome de usuário único"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="block text-[#0F1108] text-sm font-semibold mb-2">
              Email:
            </label>
            <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaEnvelope className="text-[#AF204E] ml-4 mr-2" size={20} />
              <input
                type="email"
                id="email"
                className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Display Name Field (Optional) */}
          <div className="mb-4 relative">
            <label htmlFor="displayName" className="block text-[#0F1108] text-sm font-semibold mb-2">
              Nome de Exibição (Opcional):
            </label>
            <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaUserCircle className="text-[#AF204E] ml-4 mr-2" size={20} />
              <input
                type="text"
                id="displayName"
                className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                placeholder="Seu nome de exibição (opcional)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-[#0F1108] text-sm font-semibold mb-2">
              Senha:
            </label>
            <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaLock className="text-[#AF204E] ml-4 mr-2" size={20} />
              <input
                type="password"
                id="password"
                className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Avatar URL Field (Optional) */}
          <div className="mb-6 relative">
            <label htmlFor="avatarURL" className="block text-[#0F1108] text-sm font-semibold mb-2">
              URL do Avatar (Opcional):
            </label>
            <div className="flex items-center border-2 border-[#AF204E] rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <FaImage className="text-[#AF204E] ml-4 mr-2" size={20} />
              <input
                type="url" 
                id="avatarURL"
                className="appearance-none bg-[#FFF3F3] w-full py-3 px-2 text-[#0F1108] leading-tight focus:outline-none placeholder:text-[#76868C]"
                placeholder="http://exemplo.com/sua-foto.jpg"
                value={avatarURL}
                onChange={(e) => setAvatarURL(e.target.value)}
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
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <Link
              to="/login"
              className="inline-block align-baseline mt-4 text-[#AF204E] hover:text-red-800 transition duration-300 font-semibold text-base"
            >
              Voltar à página de login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;