import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';

import { userApi, playlistApi, tagApi, trackApi } from '../services/api.js';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [usersResult, setUsersResult] = useState(null);
    const [playlistsResult, setPlaylistsResult] = useState(null);
    const [tagsResult, setTagsResult] = useState(null);
    const [tracksResult, setTracksResult] = useState(null);

    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            console.log('Termo de pesquisa vazio.');
            return;
        }

        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);

        try {
            console.log(`Pesquisando por: "${searchTerm}"`);

            const usersResponse = await userApi.get(`/nome-exibicao?q=${encodeURIComponent(searchTerm)}`);
            console.log('Usuários encontrados:', usersResponse.data);
            setUsersResult(usersResponse.data);

            const playlistsResponse = await playlistApi.get(`/publica/${encodeURIComponent(searchTerm)}`);
            console.log('Playlists públicas encontradas:', playlistsResponse.data);
            setPlaylistsResult(playlistsResponse.data);

            const tagsResponse = await tagApi.get(`/nome/${encodeURIComponent(searchTerm)}`);
            console.log('Tags encontradas:', tagsResponse.data);
            setTagsResult(tagsResponse.data);

            const tracksResponse = await trackApi.get(`/${encodeURIComponent(searchTerm)}`);
            console.log('Tracks encontradas:', tracksResponse.data);
            setTracksResult(tracksResponse.data);

        } catch (error) {
            console.error('Erro ao realizar pesquisa:', error);
            setUsersResult(null);
            setPlaylistsResult(null);
            setTagsResult(null);
            setTracksResult(null);
        }
    };

    const handleCreatePlaylist = () => {
        console.log('Botão "+ criar playlist" clicado!');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const sidebarWidth = '271px';
    const userBarWidthEstimate = '200px';
    const gapPadding = '32px'; // Equivalente a p-8

    return (
        // Adicionado 'fixed', 'top-4', 'left' e 'right' calculados, e 'z-10' para a ordem de empilhamento.
        // O 'shadow-sm' foi mantido.
        <div
            className="flex items-center bg-[#FFF9F9] p-4 rounded-lg shadow-sm z-10"
            style={{
                position: 'fixed', // Torna o elemento fixo na tela
                top: '16px', // Distância do topo, equivalente a 'top-4'
                left: `calc(${sidebarWidth} + ${gapPadding})`, // Perto da sidebar + espaço
                right: `calc(${userBarWidthEstimate} + ${gapPadding})`, // Respeita o espaço da UserBar
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
                onClick={handleCreatePlaylist}
                className="flex items-center bg-[#AF204E] text-[#FFF3F3] font-bold py-3 px-6 rounded-full
                   border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                   focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                   hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]"
            >
                <FaPlus className="mr-2" />
                <span>Criar nova playlist</span>
            </button>
        </div>
    );
}
export default SearchBar;