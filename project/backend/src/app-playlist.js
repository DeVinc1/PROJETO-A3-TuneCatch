require('dotenv').config();
const express = require('express');
const { sequelize } = require('./api/models');
const { errorHandler } = require('./utils/errorUtils');
const playlistRoutes = require('./api/routes/playlistRoutes');

const app = express();
app.use(express.json());
const PORT = process.env.PLAYLIST_PORT;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('[Playlist Service] Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false });
        console.log('[Playlist Service] Modelos sincronizados com o banco de dados.');

        app.use('/maestro', playlistRoutes);

        app.get('/', (req, res) => {
            res.send('[Playlist Service] Bem-vindo à API Maestro de Playlists do TuneCatch! 🎶');
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`🚀Serviço de Playlists iniciado e rodando na porta ${PORT}.`);
        });

    } catch (error) {
        console.error('[Playlist Service] Erro ao conectar ou iniciar o servidor:', error);
        process.exit(1);
    }
}

startServer();