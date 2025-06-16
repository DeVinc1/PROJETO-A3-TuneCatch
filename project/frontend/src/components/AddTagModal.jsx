import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaCheck } from 'react-icons/fa';
import { tagApi } from '../services/api.js';

// Reutilizar a função para obter a classe de cor com base na categoria da tag
// Idealmente, esta função estaria em um arquivo de utilitários separado (ex: src/utils/helpers.js)
const getCategoryColorClass = (category) => {
  switch (category) {
    case 'Vibe':
      return 'bg-orange-500';
    case 'Ocasião':
      return 'bg-green-500';
    case 'Gênero Musical':
      return 'bg-blue-500';
    case 'Época':
      return 'bg-purple-500';
    default:
      return 'bg-gray-400';
  }
};

function AddTagModal({ show, onClose, playlistId, currentPlaylistTags, onTagAdded }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [loadingAvailableTags, setLoadingAvailableTags] = useState(true);
  const [errorAvailableTags, setErrorAvailableTags] = useState(null);
  const [addingTagId, setAddingTagId] = useState(null); // ID da tag sendo adicionada

  useEffect(() => {
    if (show) { // Só busca quando o modal está visível
      const fetchAvailableTags = async () => {
        setLoadingAvailableTags(true);
        setErrorAvailableTags(null);
        try {
          const response = await tagApi.get('/'); // Endpoint: GET http://localhost:2250/maestro/tag
          setAvailableTags(response.data.tags || []);
        } catch (err) {
          console.error("Erro ao buscar tags disponíveis:", err);
          setErrorAvailableTags("Não foi possível carregar as tags disponíveis.");
        } finally {
          setLoadingAvailableTags(false);
        }
      };
      fetchAvailableTags();
    }
  }, [show]); // Dependência: busca quando o modal fica visível

  const handleAddTagToPlaylist = async (tagId) => {
    // Verifica se a tag já está na playlist para evitar duplicatas e desabilitar o botão
    if (currentPlaylistTags.some(tag => tag.id === tagId)) {
        console.log('Tag já adicionada a esta playlist (localmente).');
        return;
    }
    setAddingTagId(tagId); // Define qual tag está sendo adicionada
    try {
      // API: POST http://localhost:2250/maestro/tag/adicionar/{id_playlistURL}
      // Corpo: { "tagId" : "{tag_id}" }
      await tagApi.post(`/adicionar/${playlistId}`, { tagId: tagId });
      console.log(`Tag ${tagId} adicionada à playlist ${playlistId}`);
      
      onTagAdded(); // Chama o callback para o componente pai re-fetch os dados da playlist
    } catch (err) {
      console.error("Erro ao adicionar tag:", err);
      // Aqui você poderia adicionar feedback visual para o erro
    } finally {
      setAddingTagId(null); // Reseta o estado de adição
    }
  };

  if (!show) {
    return null; // Não renderiza nada se show for falso
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#FFF3F3] p-10 rounded-lg shadow-2xl border-2 border-[#AF204E] text-center w-full max-w-xl h-4/5 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0F1108]">Adicionar Tags</h2>
          <button onClick={onClose} className="text-[#0F1108] hover:text-red-500 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Conteúdo do Modal: Lista de Tags Disponíveis */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {loadingAvailableTags ? (
            <p className="text-[#0F1108] text-lg text-center mt-10">Carregando tags disponíveis...</p>
          ) : errorAvailableTags ? (
            <p className="text-red-500 text-lg text-center mt-10">{errorAvailableTags}</p>
          ) : availableTags.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-start"> {/* Grid para tags */}
              {availableTags.map(tag => {
                const isTagAlreadyAdded = currentPlaylistTags.some(plTag => plTag.id === tag.id);
                const isAddingCurrentTag = addingTagId === tag.id;

                return (
                  <div
                    key={tag.id}
                    className={`relative flex flex-col items-center p-4 rounded-xl shadow-md w-full
                                ${getCategoryColorClass(tag.category)}`} // Aplica a cor da categoria
                  >
                    {/* Ícone e Nome da Tag */}
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-3xl mr-2 text-[#FFF3F3]">{tag.iconEmoji}</span>
                      <p className="text-lg font-semibold text-[#FFF3F3]">{tag.name}</p>
                    </div>
                    {/* Categoria */}
                    <p className="text-sm text-[#FFF3F3] opacity-80 mb-3">{tag.category}</p>

                    {/* Botão de Adicionar Tag */}
                    <button
                      onClick={() => handleAddTagToPlaylist(tag.id)}
                      disabled={isTagAlreadyAdded || isAddingCurrentTag}
                      className={`w-full py-2 rounded-full font-bold transition-colors duration-200
                                 ${isTagAlreadyAdded ? 'bg-gray-400 text-white cursor-not-allowed' :
                                   isAddingCurrentTag ? 'bg-gray-300 text-gray-700 cursor-not-allowed' :
                                   'bg-[#FFF9F9] text-[#AF204E] hover:bg-gray-200'}`}
                    >
                      {isAddingCurrentTag ? 'Adicionando...' : isTagAlreadyAdded ? 'Adicionada' : 'Adicionar'}
                      {isTagAlreadyAdded && <FaCheck className="inline-block ml-2" />}
                      {!isTagAlreadyAdded && !isAddingCurrentTag && <FaPlus className="inline-block ml-2" />}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[#0F1108] text-lg text-center mt-10">
              Nenhuma tag disponível para adicionar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddTagModal;