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

const deleteBadge = async (req, res, next) => {
  try {
    const { id } = req.params;
    await badgeService.deleteBadge(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const grantBadge = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;
    const { badgeId, isVisibleOnProfile } = req.body;

    if (!badgeId) {
      throw new AppError('O ID da badge é obrigatório no corpo da requisição.', 400);
    }
    
    await badgeService.grantBadgeToUser(id_usuario, badgeId, isVisibleOnProfile);

    res.status(200).json({ message: 'Badge concedida ao usuário com sucesso!' });
  } catch (error) {
    next(error);
  }
};

const setVisibility = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;
    const { badgeId, isVisible } = req.body;

    if (!badgeId) {
        throw new AppError('O ID da badge é obrigatório no corpo da requisição.', 400);
    }

    await badgeService.setBadgeVisibility(id_usuario, badgeId, isVisible);

    res.status(200).json({ message: 'Visibilidade da badge atualizada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    createBadge,
    getAllBadges,
    getBadgeById,
    getBadgeByName,
    updateBadge,
    deleteBadge,
    grantBadge,
    setVisibility
};