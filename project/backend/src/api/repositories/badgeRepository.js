const { Badges, UserBadge } = require('../models');

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

const updateUserBadgeVisibility = async (userId, badgeId, isVisible) => {
  const userBadgeLink = await UserBadge.findOne({
    where: {
      user_id: userId,
      badge_id: badgeId,
    },
  });

  if (userBadgeLink) {
    userBadgeLink.isVisibleOnProfile = isVisible;
    await userBadgeLink.save();
  }

  return userBadgeLink;
};


module.exports = {
  createBadge,
  findByName,
  findAllBadges,
  findById,
  deleteBadgeById,
  updateUserBadgeVisibility
};