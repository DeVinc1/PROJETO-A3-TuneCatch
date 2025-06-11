const express = require('express');
const badgeController = require('../controllers/badgeController');

const router = express.Router();

/**
 * @Route   POST /badges
 * @Desc    Cria uma nova badge.
 */
router.post('/badges', badgeController.createBadge);

module.exports = router;