const { Badges } = require('../models');

const createBadge = async (badgeData) => {
  const badge = await Badges.create(badgeData);
  return badge;
};

const findByName = async (name) => {
  const badge = await Badges.findOne({ where: { name } });
  return badge;
};

const findAllBadges = async () => {
  const badges = await Badges.findAll();
  return badges;
};

const findById = async (id) => {
  const badge = await Badges.findByPk(id);
  return badge;
}

const findBadgeByName = async (name) => {
  const badge = await badgeRepository.findByName(name);
  if (!badge) {
    throw new AppError('Badge com esse nome não encontrada.', 404);
  }
  return badge;
};

module.exports = {
  createBadge,
  findByName,
  findAllBadges,
  findById,
  findBadgeByName
};