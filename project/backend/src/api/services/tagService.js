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


module.exports = {
  createNewTag,
  getAllTags
};