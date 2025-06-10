const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @Route POST /maestro/usuario
 * @Desc Resgistra um novo usuário
 * @Access Public
 */
router.post('/usuario', userController.createUser);

module.exports = router;