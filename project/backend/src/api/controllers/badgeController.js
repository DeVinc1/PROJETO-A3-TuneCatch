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

module.exports = {
    createBadge,
};