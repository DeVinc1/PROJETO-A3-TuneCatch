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

const deleteBadgeById = async (badgeId) => {
  const deletedRowCount = await Badges.destroy({
    where: { id: badgeId },
  });
  return deletedRowCount;
};

module.exports = {
  createBadge,
  findByName,
  findAllBadges,
  findById,
  deleteBadgeById
};