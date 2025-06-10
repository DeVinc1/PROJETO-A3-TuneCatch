const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 *  @Route POST /maestro/usuario
 *  @Desc Resgistra um novo usuário
 *  @Access Public
 */
router.post('/usuario', userController.createUser);

/**
 *  @Route POST /maestro/usuario/fazer-login
 *  @Desc Realiza o login de um usuário
 *  @Acess Public 
 */
router.post('/usuario/fazer-login', userController.login);

module.exports = router;