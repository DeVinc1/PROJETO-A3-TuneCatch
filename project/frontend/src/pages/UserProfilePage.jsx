import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaEllipsisH, FaPencilAlt, FaArrowRight } from 'react-icons/fa'; 
import { userApi } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function UserProfilePage() {
    const { userId } = useParams();
    const { userLoggedId, isAuthenticated } = useAuth(); 
    const [userData, setUserData] = useState(null);
    const [loggedInUserFollowingList, setLoggedInUserFollowingList] = useState([]); 
    const [isFollowing, setIsFollowing] = useState(false); 
    const [hoveredBadgeId, setHoveredBadgeId] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [followLoading, setFollowLoading] = useState(false); 
    const [error, setError] = useState(null);
    const [followError, setFollowError] = useState(null);
    const navigate = useNavigate();

    const fetchProfileData = async () => {
        setLoading(true); 
        setError(null);
        try {
            const response = await userApi.get(`/${userId}`);
            setUserData(response.data);
        } catch (err) {
            console.error("Erro ao buscar dados do perfil do usuário:", err);
            setError("Não foi possível carregar este perfil. O usuário pode não existir ou há um problema de conexão.");
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

  
    const fetchLoggedInUserFollowingList = async () => {
        if (!isAuthenticated || !userLoggedId) {
            setLoggedInUserFollowingList([]); 
            return;
        }
        try {
            const response = await userApi.get(`/${userLoggedId}`); 
            setLoggedInUserFollowingList(response.data.following || []);
        } catch (err) {
            console.error("Erro ao buscar dados de seguindo do usuário logado:", err);
            setLoggedInUserFollowingList([]);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProfileData();
        } else {
            setError("ID de usuário não fornecido na URL.");
            setLoading(false);
        }
    }, [userId]); 

    useEffect(() => {
        if (isAuthenticated && userLoggedId) {
             fetchLoggedInUserFollowingList();
        } else {
            setLoggedInUserFollowingList([]);
        }
    }, [userLoggedId, isAuthenticated, userId]); 
    useEffect(() => {
        if (loggedInUserFollowingList && userData) {

            const isFollowingUser = loggedInUserFollowingList.some(followedUser => followedUser.id === userData.id);
            setIsFollowing(isFollowingUser);
        } else {
            setIsFollowing(false);
        }
    }, [loggedInUserFollowingList, userData]); 


    const handleFollowToggle = async () => {
        if (!isAuthenticated) {
            navigate('/login'); 
            return;
        }
        setFollowLoading(true);
        setFollowError(null);
        try {
            // Endpoint: POST http://localhost:2100/maestro/usuario/seguir/{id_logado}
            // Corpo: { "idToBeFollowed": {id_url} }
            const response = await userApi.post(`/seguir/${userLoggedId}`, { idToBeFollowed: userId });
            console.log("Ação de seguir/deixar de seguir realizada:", response.data);

            await fetchProfileData(); 
            await fetchLoggedInUserFollowingList(); 

            
        } catch (err) {
            console.error("Erro ao seguir/deixar de seguir:", err);
            setFollowError(err.response?.data?.message || "Erro ao realizar a ação. Tente novamente.");
        } finally {
            setFollowLoading(false);
        }
    };

    const handleClickPlaylist = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };

    const handleClickUser = (clickedUserId) => {
        if (clickedUserId === userLoggedId) {
            navigate('/profile');
        } else {
             navigate(`/users/${clickedUserId}`);
        }
    };

    // --- Renderização Condicional (Loading, Error, No Data) ---

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <p className="text-[#0F1108] text-lg">Carregando perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <p className="text-[#0F1108] text-lg">Perfil não encontrado ou ID inválido.</p>
            </div>
        );
    }

    // Verifica se o perfil que está sendo visitado é o do próprio usuário logado
    const isOwnProfile = isAuthenticated && (userLoggedId === userData.id);

    return (
        <div className="p-8">
            {/* Topo do Perfil */}
            <div className="flex items-start mb-10">
                {/* Imagem de Perfil Grande */}
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#AF204E] flex-shrink-0">
                    <img
                        src={userData.avatarURL || 'https://placehold.co/256x256/E0E0E0/787878?text=Sem+Avatar'}
                        alt={`${userData.username}'s profile`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info do Perfil */}
                <div className="ml-12 flex-grow">
                    <p className="text-[#0F1108] text-lg italic font-normal">Perfil</p>
                    <h1 className="text-5xl font-bold text-[#0F1108] mt-1">@{userData.username}</h1>
                    {userData.displayName && (
                        <p className="text-[#0F1108] text-xl italic font-normal mt-4">
                            - {userData.displayName}
                        </p>
                    )}

                    {/* Seção de Badges */}
                    {userData.userBadges && userData.userBadges.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-6">
                            {userData.userBadges.map(badge => (
                                <div
                                    key={badge.id}
                                    className="relative flex items-center px-4 py-2 rounded-xl shadow-md text-[#FFF3F3] text-base font-semibold"
                                    style={{
                                        background: 'linear-gradient(to right, #926E2D, #C6B069, #926E2D)',
                                    }}
                                    onMouseEnter={() => setHoveredBadgeId(badge.id)}
                                    onMouseLeave={() => setHoveredBadgeId(null)}
                                >
                                    {badge.iconURL && badge.iconURL.startsWith('http') ? (
                                        <img src={badge.iconURL} alt={badge.name} className="w-6 h-6 mr-2 object-contain" />
                                    ) : (
                                        <span className="text-2xl mr-2">{badge.iconURL}</span>
                                    )}
                                    <span>{badge.name}</span>

                                    {hoveredBadgeId === badge.id && (
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-40">
                                            {badge.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Contagem de Seguidores, Seguindo E Botão Seguir/Deixar de Seguir */}
                    <div className="flex items-center space-x-6 mt-6 text-[#0F1108] w-full">
                        <div className="flex space-x-6">
                            <p className="text-xl">
                                <span className="font-normal">{userData.followers?.length || 0}</span> <span className="font-bold">Seguidores</span>
                            </p>
                            <p className="text-xl">
                                <span className="font-normal">{userData.following?.length || 0}</span> <span className="font-bold">Seguindo</span>
                            </p>
                        </div>
                        
                        {/* Botão Seguir/Deixar de Seguir (visível apenas se não for o próprio perfil) */}
                        {!isOwnProfile && isAuthenticated && (
                            <div className="flex items-center space-x-4 ml-auto relative">
                                {followError && (
                                    <p className="text-red-500 text-sm mr-2">{followError}</p>
                                )}
                                <button
                                    onClick={handleFollowToggle}
                                    className={`flex items-center text-[#FFF9F9] font-bold py-2 px-8 rounded-full
                                        border-2 border-[#FFF3F3] shadow-[0px_0px_0px_3px_#AF204E]
                                        focus:outline-none focus:shadow-outline transition duration-300 ease-in-out
                                        ${followLoading ? 'opacity-70 cursor-not-allowed bg-[#AF204E]' : 'hover:bg-[#C93B6E] hover:shadow-[0px_0px_0px_3px_#C93B6E]'}
                                        ${isFollowing ? 'bg-[#AF204E]' : 'bg-[#AF204E]'}`}
                                    disabled={followLoading}
                                >
                                    <FaUser className="mr-2" />
                                    {followLoading ? 'Aguarde...' : (isFollowing ? 'Deixar de Seguir' : 'Seguir')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr className="my-10 border-t border-gray-300" />

            {/* Seção de Playlists Criadas deste Usuário (apenas visíveis) */}
            <h3 className="text-2xl font-normal text-[#0F1108] mb-6">{userData.username} que criou essas!</h3>
            <div className="relative mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start">
                    {userData.createdPlaylists && userData.createdPlaylists.filter(pl => pl.isVisible).length > 0 ? (
                        userData.createdPlaylists.filter(pl => pl.isVisible).slice(0, 7).map((playlist) => (
                            <button
                                key={playlist.id}
                                onClick={() => handleClickPlaylist(playlist.id)}
                                className="flex flex-col items-start text-left w-48 transition-transform duration-300 hover:scale-105"
                            >
                                <div className="w-48 h-48 overflow-hidden rounded-lg mb-2 shadow-md border border-gray-200">
                                    <img
                                        src={playlist.coverImageURL || 'https://placehold.co/192x192/E0E0E0/787878?text=Sem+Capa'}
                                        alt={playlist.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-[#0F1108] font-normal text-lg truncate w-full">{playlist.name}</p>
                            </button>
                        ))
                    ) : (
                        <p className="text-[#0F1108] text-lg col-span-full">Este usuário ainda não criou nenhuma playlist pública...</p>
                    )}
                </div>

                {/* Botão circular com seta para "Ver todas as Playlists do Usuário" */}
                {/* Aparece apenas se houver playlists criadas visíveis E mais de 7 */}
                {userData.createdPlaylists && userData.createdPlaylists.filter(pl => pl.isVisible).length > 7 && (
                    <button
                        onClick={() => navigate(`/playlists-from/${userId}`)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#E67A9D] flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#E67A9D]/50"
                        aria-label={`Ver todas as playlists de ${userData.username}`}
                    >
                        <FaArrowRight className="text-[#FFF9F9] text-xl" />
                    </button>
                )}
            </div>

            {/* Seção: Seguidores */}
            <h3 className="text-2xl font-normal text-[#0F1108] mb-6">{userData.username} tem muitos fãs! Esses são alguns...</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px] justify-items-start">
                {userData.followers && userData.followers.length > 0 ? (
                    userData.followers.map((follower) => (
                        <button
                            key={follower.id}
                            onClick={() => handleClickUser(follower.id)}
                            className="flex flex-col items-start text-left w-48 transition-transform duration-300 hover:scale-105"
                        >
                            <div className="w-48 h-48 overflow-hidden rounded-full mb-2 shadow-md border-4 border-[#AF204E]">
                                <img
                                    src={follower.avatarURL || 'https://placehold.co/192x192/E0E0E0/787878?text=Sem+Avatar'}
                                    alt={follower.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-[#0F1108] font-normal text-lg truncate w-full">@{follower.username}</p>
                        </button>
                    ))
                ) : (
                    <p className="text-[#0F1108] text-lg col-span-full">Este usuário ainda não tem nenhum seguidor.</p>
                )}
            </div>

        </div>
    );
}

export default UserProfilePage;