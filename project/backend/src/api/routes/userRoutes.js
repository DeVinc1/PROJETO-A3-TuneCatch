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

/**
 *  @Route   GET /usuario/nome-exibicao?q={query}
 *  @Desc    Busca usuários por nome de exibição (query param 'q')
 *  @Access  Public
 */
router.get('/usuario/nome-exibicao', userController.getUsersByDisplayName);

/**
 *  @Route GET /maestro/usuario/:id
 *  @Desc Obtém os detalhes de um usuário pelo ID
 *  @Access Public
 */
router.get('/usuario/:id', userController.getUserByID);

/**
 *  @Route GET /maestro/usuario/username/:username
 *  @Desc Obtém os detalhes simples de um usuário pelo nome de usuário
 *  @Access Public
 */
router.get('/usuario/nome-usuario/:username', userController.getUsersByDisplayName);


module.exports = router;