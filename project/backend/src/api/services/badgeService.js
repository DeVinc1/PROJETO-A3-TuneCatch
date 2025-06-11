const badgeRepository = require('../repositories/badgeRepository');
const { AppError } = require('../../utils/errorUtils');


const createNewBadge = async ({ name, description, iconURL }) => {
  if (!name || !description || !iconURL) {
    throw new AppError('Nome, descrição e URL do ícone são obrigatórios.', 400);
  }

  const existingBadge = await badgeRepository.findByName(name);
  if (existingBadge) {
    throw new AppError('Esse nome de badge já existe no sistema!', 409, 'name');
  }

  const newBadge = await badgeRepository.createBadge({ name, description, iconURL });

  return {
    id: newBadge.id,
    name: newBadge.name,
    description: newBadge.description,
    iconURL: newBadge.iconURL,
  };
};

const getAllBadges = async () => {
  const badges = await badgeRepository.findAllBadges();
  return badges;
};

const getBadgeById = async (badgeId) => {
  const badge = await badgeRepository.findById(badgeId);
  if (!badge) {
    throw new AppError('Badge não encontrada.', 404);
  }
  return badge;
};

module.exports = {
  createNewBadge,
  getAllBadges,
  getBadgeById
};