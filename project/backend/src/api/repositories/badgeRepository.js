const { Badges } = require('../models');

const createBadge = async (badgeData) => {
  const badge = await Badges.create(badgeData);
  return badge;
};

const findByName = async (name) => {
  const badge = await Badges.findOne({ where: { name } });
  return badge;
};


module.exports = {
  createBadge,
  findByName,
};