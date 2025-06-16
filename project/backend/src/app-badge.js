
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./api/models');
const { errorHandler } = require('./utils/errorUtils');
const badgeRoutes = require('./api/routes/badgeRoutes');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Permita requisições apenas frontend vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
const PORT = process.env.BADGE_PORT;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('[Badge Service] Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false });
        console.log('[Badge Service] Modelos sincronizados com o banco de dados.');

        app.use('/maestro', badgeRoutes); 

        app.get('/', (req, res) => {
            res.send('[Badge Service] Bem-vindo à API Maestro de Badges do TuneCatch! 🎶');
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`🚀Serviço de Badges iniciado e rodando na porta ${PORT}.`);
        });

    } catch (error) {
        console.error('[Badge Service] Erro ao conectar ou iniciar o servidor:', error);
        process.exit(1);
    }
}

startServer();