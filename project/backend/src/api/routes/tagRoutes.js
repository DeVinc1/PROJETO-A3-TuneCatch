const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

/**
 * @Route   GET maestro/tag
 * @Desc    Busca todas as tags do sistema.
 */
router.get('/tag', tagController.getAllTags);

/**
 * @Route   GET maestro/playlists-marcadas?q=tag1,tag2
 * @Desc    Busca todas as playlists marcadas com tags.
 */
router.get('/tag/playlists-marcadas', tagController.findPlaylistsByTags);

/**
 * @Route   GET maestro/playlists-tags/:id_playlist
 * @Desc    Busca as tags de uma playlist específica.
 */
router.get('/tag/playlists-tags/:id_playlist', tagController.getPlaylistTags);

/**
 * @Route   GET maestro/tag/:id
 * @Desc    Busca as tags do sistema pelo ID.
 */
router.get('/tag/:id', tagController.getTagById);

/**
 * @Route   GET maestro/tag/nome/:name
 * @Desc    Busca tags do sistema pelo seu nome.
 */
router.get('/tag/nome/:name', tagController.searchTags);

/**
 * @Route   POST maestro/tag
 * @Desc    Cria uma nova tag.
 */
router.post('/tag', tagController.createTag);

/**
 * @Route   PUT maestro/tag/:id
 * @Desc    Atualiza uma tag existente.
 */
router.put('/tag/:id', tagController.updateTag);

/**
 * @Route   DELETE maestro/tag/:id
 * @Desc    Deleta uma tag existente.
 */
router.delete('/tag/:id', tagController.deleteTag);

/**
 * @Route   POST maestro/tag/adicionar/:id_playlist
 * @Desc    Adiciona tags à uma playlist específica.
 */
router.post('/tag/adicionar/:id_playlist', tagController.toggleTagOnPlaylist);



module.exports = router;
