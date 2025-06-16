import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa'; // Importe FaTimes para fechar o modal
import { playlistApi } from '../services/api.js'; // Importe a API de playlist
import { useAuth } from '../contexts/AuthContext.jsx'; // Importe o AuthContext para o ID do usuário logado

function SearchBar() {
    const { userLoggedId, isAuthenticated } = useAuth(); // Pega o ID do usuário logado
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Estados para armazenar os resultados da busca (mantidos, embora não exibidos diretamente aqui)
    const [usersResult, setUsersResult] = useState(null);
    const [playlistsResult, setPlaylistsResult] = useState(null);
    const [tagsResult, setTagsResult] = useState(null);
    const [tracksResult, setTracksResult] = useState(null);

    // NOVO: Estados para o modal de criar playlist
    const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [newPlaylistIsVisible, setNewPlaylistIsVisible] = useState(true); // Default true
    const [newPlaylistCoverImageURL, setNewPlaylistCoverImageURL] = useState('');
    const [createFormLoading, setCreateFormLoading] = useState(false);
    const [createFormError, setCreateFormError] = useState(null);
    const [createFormSuccess, setCreateFormSuccess] = useState(null);


    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            console.log('Termo de pesquisa vazio.');
            return;
        }
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);

        // As chamadas de API de busca serão mantidas aqui, mas não são o foco principal desta task
        try {
            console.log(`Pesquisando por: "${searchTerm}"`);
            const usersResponse = await userApi.get(`/nome-exibicao?q=${encodeURIComponent(searchTerm)}`);
            setUsersResult(usersResponse.data);
            const playlistsResponse = await playlistApi.get(`/publica/${encodeURIComponent(searchTerm)}`);
            setPlaylistsResult(playlistsResponse.data);
            const tagsResponse = await tagApi.get(`/nome/${encodeURIComponent(searchTerm)}`);
            setTagsResult(tagsResponse.data);
            const tracksResponse = await trackApi.get(`/${encodeURIComponent(searchTerm)}`);
            setTracksResult(tracksResponse.data);
        } catch (error) {
            console.error('Erro ao realizar pesquisa:', error);
            setUsersResult(null);
            setPlaylistsResult(null);
            setTagsResult(null);
            setTracksResult(null);
        }
    };

    // NOVO: Handlers para o Modal de Criação de Playlist
    const handleCreatePlaylistClick = () => {
        if (!isAuthenticated || !userLoggedId) {
            alert('Você precisa estar logado para criar uma playlist.'); // Substituir por modal de notificação
            navigate('/login');
            return;
        }
        setShowCreatePlaylistModal(true);
        // Limpa os campos do formulário ao abrir
        setNewPlaylistName('');
        setNewPlaylistDescription('');
        setNewPlaylistIsVisible(true);
        setNewPlaylistCoverImageURL('');
        setCreateFormError(null);
        setCreateFormSuccess(null);
    };

    const handleCloseCreatePlaylistModal = () => {
        setShowCreatePlaylistModal(false);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
        setNewPlaylistIsVisible(true);
        setNewPlaylistCoverImageURL('');
        setCreateFormError(null);
        setCreateFormSuccess(null);
    };

    const handleSubmitCreatePlaylist = async (e) => {
        e.preventDefault();
        setCreateFormLoading(true);
        setCreateFormError(null);
        setCreateFormSuccess(null);

        const payload = {
            name: newPlaylistName,
            description: newPlaylistDescription,
            isVisible: newPlaylistIsVisible,
            coverImageURL: newPlaylistCoverImageURL || "https://placehold.co/600x400/E0E0E0/787878?text=Nova+Playlist", // Placeholder se não houver URL
        };

        try {
            // Endpoint: POST http://localhost:2200/maestro/playlist/{id_user_logado}
            const response = await playlistApi.post(`/${userLoggedId}`, payload);
            console.log("Playlist criada com sucesso:", response.data);
            setCreateFormSuccess("Playlist criada com sucesso!");

            // Atualiza a página inteira (navegando para a própria página de playlists do usuário ou home)
            // Ou apenas recarregar os dados, se a página atual consumir playlists dinamicamente.
            // Para atualizar a página inteira:
            navigate(`/playlist/${response.data.id}`); // Redireciona para a playlist recém-criada
            
            // Ou se quiser apenas recarregar a página atual (não recomendado para criação):
            // window.location.reload(); 

            setTimeout(() => {
                handleCloseCreatePlaylistModal();
            }, 1500);

        } catch (err) {
            console.error("Erro ao criar playlist:", err);
            const errorMessage = err.response?.data?.message || "Erro ao criar playlist. Verifique os dados.";
            setCreateFormError(errorMessage);
        } finally {
            setCreateFormLoading(false);
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const sidebarWidth = '271px';
    const userBarWidthEstimate = '200px';
    const gapPadding = '32px';

    return (
        <div
            className="flex items-center bg-[#FFF9F9] p-4 rounded-lg z-10"
            style={{
                position: 'fixed',
                top: '16px',
                left: `calc(${sidebarWidth} + ${gapPadding})`,
                right: `calc(${userBarWidthEstimate} + ${gapPadding})`,
            }}
        >
            {/* Campo de Pesquisa */}
            <div className="relative flex items-center flex-grow mr-4">
                <input
                    type="text"
                    placeholder="O que você quer escutar agora?"
                    className="w-full h-12 pr-10 pl-4 rounded-full border-2 border-[#AF204E] bg-[#FFF3F3]
                               text-[#AF204E] placeholder-[#76868C] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50
                               transition duration-200 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Botão de Lupa (separado) */}
            <button
                onClick={handleSearch}
                className="flex items-center justify-center w-10 h-10 rounded-full text-[#0F1108] transition-colors duration-300 mr-8"
                aria-label="Pesquisar"
            >
                <FaSearch className="text-2xl" />
            </button>

            {/* Botão "+ criar playlist" */}
            <button
                onClick={handleCreatePlaylistClick} // Chama a nova função para abrir o modal
                className="flex items-center bg-[#AF204E] text-[#FFF3F3] font-bold py-3 px-6 rounded-full
                           border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                           focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                           hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]"
            >
                <FaPlus className="mr-2" />
                <span>Criar nova playlist</span>
            </button>

            {/* NOVO: Modal de Criar Playlist */}
            {showCreatePlaylistModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-[#FFF3F3] p-8 rounded-lg shadow-2xl border-2 border-[#AF204E] text-center w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#0F1108]">Criar Nova Playlist</h2>
                            <button onClick={handleCloseCreatePlaylistModal} className="text-[#0F1108] hover:text-red-500 transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {createFormError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                                <strong className="font-bold">Erro!</strong>
                                <span className="block sm:inline ml-2">{createFormError}</span>
                            </div>
                        )}
                        {createFormSuccess && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                                <strong className="font-bold">Sucesso!</strong>
                                <span className="block sm:inline ml-2">{createFormSuccess}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmitCreatePlaylist} className="text-left">
                            {/* Nome da Playlist */}
                            <div className="mb-4">
                                <label htmlFor="newPlaylistName" className="block text-[#0F1108] text-sm font-semibold mb-2">Nome da Playlist:</label>
                                <input
                                    type="text"
                                    id="newPlaylistName"
                                    className="w-full py-2 px-3 rounded-md border border-gray-300 bg-[#FFF9F9] text-[#0F1108] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Descrição */}
                            <div className="mb-4">
                                <label htmlFor="newPlaylistDescription" className="block text-[#0F1108] text-sm font-semibold mb-2">Descrição (Opcional):</label>
                                <textarea
                                    id="newPlaylistDescription"
                                    className="w-full py-2 px-3 rounded-md border border-gray-300 bg-[#FFF9F9] text-[#0F1108] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50 h-24 resize-none"
                                    value={newPlaylistDescription}
                                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                                ></textarea>
                            </div>

                            {/* URL da Capa */}
                            <div className="mb-4">
                                <label htmlFor="newPlaylistCoverImageURL" className="block text-[#0F1108] text-sm font-semibold mb-2">URL da Imagem de Capa (Opcional):</label>
                                <input
                                    type="url"
                                    id="newPlaylistCoverImageURL"
                                    className="w-full py-2 px-3 rounded-md border border-gray-300 bg-[#FFF9F9] text-[#0F1108] focus:outline-none focus:ring-2 focus:ring-[#AF204E]/50"
                                    value={newPlaylistCoverImageURL}
                                    onChange={(e) => setNewPlaylistCoverImageURL(e.target.value)}
                                />
                            </div>

                            {/* Visibilidade */}
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="newPlaylistIsVisible"
                                    className="mr-2 h-4 w-4 text-[#AF204E] rounded border-gray-300 focus:ring-[#AF204E]"
                                    checked={newPlaylistIsVisible}
                                    onChange={(e) => setNewPlaylistIsVisible(e.target.checked)}
                                />
                                <label htmlFor="newPlaylistIsVisible" className="text-[#0F1108] text-sm font-semibold">Tornar playlist pública?</label>
                            </div>

                            {/* Botões de Ação do Modal */}
                            <div className="flex justify-around space-x-4 mt-6">
                                <button
                                    type="submit"
                                    className={`bg-[#AF204E] text-[#FFF3F3] font-bold py-2 px-8 rounded-full
                                               border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                                               focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                                               ${createFormLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]'}`}
                                    disabled={createFormLoading}
                                >
                                    {createFormLoading ? 'Criando...' : 'Criar Playlist'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseCreatePlaylistModal}
                                    className="bg-gray-300 text-[#0F1108] font-bold py-2 px-8 rounded-full
                                               hover:bg-gray-400 transition duration-300"
                                    disabled={createFormLoading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;