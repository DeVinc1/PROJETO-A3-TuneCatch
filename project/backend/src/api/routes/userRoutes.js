const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 *  @Route  POST /maestro/usuario
 *  @Desc   Resgistra um novo usuário
 */
router.post('/usuario', userController.createUser);

/**
 *  @Route  POST /maestro/usuario/fazer-login
 *  @Desc   Realiza o login de um usuário
 */
router.post('/usuario/fazer-login', userController.login);

/**
 *  @Route  GET /usuario/nome-exibicao?q={query}
 *  @Desc   Busca usuários por nome de exibição (passado por query na URL)
 */
router.get('/usuario/nome-exibicao', userController.getUsersByDisplayName);

/**
 *  @Route  GET /maestro/usuario/:id
 *  @Desc   Obtém os detalhes de um usuário pelo ID
 */
router.get('/usuario/:id', userController.getUserByID);

/**
 *  @Route  GET /maestro/usuario/username/:username
 *  @Desc   Obtém os detalhes simples de um usuário pelo nome de usuário
 */
router.get('/usuario/nome-usuario/:username', userController.getUserByUsername);

/**
 *  @Route  PUT /maestro/usuario/:id/detalhes
 *  @Desc   Atualiza os detalhes de um usuário pelo ID
 */
router.put('/usuario/:id/detalhes', userController.updateProfile);

/**
 * @Route   PUT /maestro/usuario/:id/senha
 * @Desc    Atualiza a senha de um usuário pelo ID
 */ 
router.put('/usuario/:id/senha', userController.updatePassword);

/**
 * @route   POST /usuario/seguir/:id_usuario
 * @desc    Segue ou deixa de seguir um usuário.
 */
router.post('/usuario/seguir/:id_usuario', userController.followUser);

module.exports = router;