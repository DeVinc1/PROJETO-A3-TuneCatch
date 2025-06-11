const { get } = require('../routes/badgeRoutes');
const badgeService = require('../services/badgeService');

const createBadge = async (req, res, next) => {
    try {
        const { name, description, iconURL } = req.body;

        const newBadge = await badgeService.createNewBadge({ name, description, iconURL });

        res.status(201).json({
            message: 'Badge criada com sucesso',
            badge: newBadge,
        });

    } catch (error) {
        next(error);
    }
};

const getAllBadges = async (req, res, next) => {
  try {
    const badges = await badgeService.getAllBadges();
    res.status(200).json({ badges });
  } catch (error) {
    next(error);
  }
};

const getBadgeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const badge = await badgeService.getBadgeById(id);
    res.status(200).json(badge);
  } catch (error) {
    next(error);
  }
};

const getBadgeByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const badge = await badgeService.getBadgeByName(name);
    res.status(200).json(badge);
  } catch (error) {
    next(error);
  }
};

const updateBadge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, iconURL } = req.body;
    const updatedBadge = await badgeService.updateBadge(id, { name, description, iconURL });
    res.status(200).json({
      message: 'Badge modificada com sucesso',
      badge: updatedBadge,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
    createBadge,
    getAllBadges,
    getBadgeById,
    getBadgeByName,
    updateBadge
};