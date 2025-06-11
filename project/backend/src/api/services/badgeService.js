const badgeRepository = require('../repositories/badgeRepository');
const userRepository = require('../repositories/userRepository'); 
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

const getBadgeByName = async (badgeName) => {
  const badge = await badgeRepository.findByName(badgeName);
  if (!badge) {
    throw new AppError('Badge não encontrada.', 404);
  }
  return badge;
};

const updateBadge = async (badgeId, updateData) => {
  const badge = await badgeRepository.findById(badgeId);
  if (!badge) {
    throw new AppError('A badge referenciada não existe.', 404);
  }

  const { name, description, iconURL } = updateData;

  if (!name || !description || !iconURL) {
    throw new AppError('Nome, descrição e URL do ícone são obrigatórios.', 400);
  }

  if (name && name !== badge.name) {
    const existingBadge = await badgeRepository.findByName(name);
    if (existingBadge) {
      throw new AppError('Esse nome de badge já existe no sistema!', 409);
    }
    badge.name = name;
  }

  badge.description = description;

  badge.iconURL = iconURL;
  
  await badge.save();
  return badge;
};

const deleteBadge = async (badgeId) => {
  const result = await badgeRepository.deleteBadgeById(badgeId);

  if (result === 0) {
    throw new AppError('A badge a ser excluída não foi encontrada.', 404);
  }
};

const grantBadgeToUser = async (userId, badgeId, isVisibleOnProfile) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('O perfil do usuário não foi encontrado.', 404);
  }

  const badge = await badgeRepository.findById(badgeId);
  if (!badge) {
    throw new AppError('A badge com o ID fornecido não foi encontrada.', 404);
  }

  const alreadyHasBadge = await user.hasUserBadges(badge);
  if (alreadyHasBadge) {
    throw new AppError('Este usuário já possui esta badge.', 409);
  }

  await user.addUserBadges(badge, {
    through: { isVisibleOnProfile: !!isVisibleOnProfile } 
  });
};

module.exports = {
  createNewBadge,
  getAllBadges,
  getBadgeById,
  getBadgeByName,
  updateBadge,
  deleteBadge,
  grantBadgeToUser,
};