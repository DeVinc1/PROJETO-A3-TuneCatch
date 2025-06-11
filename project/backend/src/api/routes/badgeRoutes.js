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

/**
 * @Route   PUT maestro/badges/:id
 * @Desc    Atualiza uma badge existente.
 */
router.put('/badges/:id', badgeController.updateBadge);

/**
 * @Route   DELETE /:id
 * @Desc    Exclui uma badge existente.
 */
router.delete('/badges/:id', badgeController.deleteBadge);

/**
 * @Route   POST /conceder/:id_usuario
 * @Desc    Concede uma badge a um usuário.
 */
router.post('/badges/conceder/:id_usuario', badgeController.grantBadge);

module.exports = router;