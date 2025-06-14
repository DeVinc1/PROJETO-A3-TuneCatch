const tagRepository = require('../repositories/tagRepository');
const { AppError } = require('../../utils/errorUtils');
const { get } = require('../routes/tagRoutes');

const createNewTag = async (tagDetails) => {
  const { name, category, iconEmoji } = tagDetails;

  if (!name || !category || !iconEmoji) {
    throw new AppError('Nome, categoria e ícone emoji são obrigatórios.', 400);
  }

  const allowedCategories = ['Vibe', 'Ocasião', 'Gênero Musical'];
  if (!allowedCategories.includes(category)) {
    throw new AppError(`A categoria '${category}' é inválida. As categorias permitidas são: ${allowedCategories.join(', ')}.`, 400);
  }

  const existingTag = await tagRepository.findTagByName(name);
  if (existingTag) {
    throw new AppError('Esse nome de tag já existe no sistema!', 409);
  }

  const newTag = await tagRepository.createTag({ name, category, iconEmoji });
  return newTag;
};

const getAllTags = async () => {
    return await tagRepository.findAllTags();
};

const searchTags = async (searchQuery) => {
    if (!searchQuery) {
        return [];
    }
    const tags = await tagRepository.searchTagsByName(searchQuery);
    return tags;
};

const getTagById = async (tagId) => {
    const tag = await tagRepository.findTagById(tagId);
    if (!tag) {
        throw new AppError('Tag não encontrada.', 404);
    }
    return tag;
};

const updateTag = async (tagId, updateData) => {
    const { name, category, iconEmoji } = updateData;

    if (!name || !category || !iconEmoji) {
        throw new AppError('Todos os campos (name, category, iconEmoji) são obrigatórios para a edição.', 400);
    }

    const tag = await tagRepository.findTagById(tagId);
    if (!tag) {
        throw new AppError('Tag não encontrada.', 404);
    }

    const allowedCategories = ['Vibe', 'Ocasião', 'Gênero Musical'];
    if (!allowedCategories.includes(category)) {
        throw new AppError(`A categoria '${category}' é inválida. As categorias permitidas são: ${allowedCategories.join(', ')}.`, 400);
    }

    if (name !== tag.name) {
        const existingTag = await tagRepository.findTagByName(name);
        if (existingTag) {
            throw new AppError('Esse nome de tag já existe no sistema!', 409);
        }
    }

    tag.name = name;
    tag.category = category;
    tag.iconEmoji = iconEmoji;
    await tag.save();

    return tag;
};

const deleteTag = async (tagId) => {
    const result = await tagRepository.deleteTagById(tagId);

    if (result === 0) {
        throw new AppError('A tag a ser excluída não foi encontrada.', 404);
    }
};

const toggleTagOnPlaylist = async (playlistId, tagId) => {
    const playlist = await tagRepository.findPlaylistWithTags(playlistId);
    if (!playlist) {
        throw new AppError('Playlist não encontrada.', 404);
    }

    const tag = await tagRepository.findTagById(tagId);
    if (!tag) {
        throw new AppError('Tag não encontrada.', 404);
    }

    const hasTag = await playlist.hasTags(tag);

    let message;

    if (hasTag) {
        await playlist.removeTags(tag);
        message = `A tag '${tag.name}' foi removida da playlist '${playlist.name}'.`;
    } else {
        await playlist.addTags(tag);
        message = `A tag '${tag.name}' foi adicionada à playlist '${playlist.name}'.`;
    }

    const updatedPlaylist = await tagRepository.findPlaylistWithTags(playlistId);

    return { message, playlist: updatedPlaylist };
};

const getPlaylistsByTags = async (tagQuery) => {
    if (!tagQuery) {
        return [];
    }

    const tagNames = tagQuery.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (tagNames.length === 0) {
        return [];
    }
    
    const playlists = await tagRepository.findPlaylistsByTagNames(tagNames);
    return playlists;
};

module.exports = {
  createNewTag,
  getAllTags,
  searchTags,
  getTagById,
  updateTag,
  deleteTag,
  toggleTagOnPlaylist,
  getPlaylistsByTags
};