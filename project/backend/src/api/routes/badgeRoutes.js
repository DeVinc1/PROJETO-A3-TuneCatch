const express = require('express');
const badgeController = require('../controllers/badgeController');

const router = express.Router();

/**
 * @Route   POST maestro/badges
 * @Desc    Cria uma nova badge.
 */
router.post('/badges', badgeController.createBadge);

/**
 * @Route   GET maestro/badges
 * @Desc    Retorna todas as badges cadastradas.
 */
router.get('/badges', badgeController.getAllBadges);

/**
 * @Route   GET maestro/badges/nome/:name
 * @Desc    Retorna uma badge específica por meio de seu nome.
 */
router.get('/badges/nome/:name', badgeController.getBadgeByName);

/**
 * @Route   GET maestro/badges/:id
 * @Desc    Retorna uma badge específica pelo ID.
 */
router.get('/badges/:id', badgeController.getBadgeById);


module.exports = router;