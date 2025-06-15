require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./api/models'); 
const { errorHandler } = require('./utils/errorUtils');
const trackRoutes = require('./api/routes/trackRoutes');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Permita requisições apenas frontend vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(express.json());

const PORT = process.env.TRACK_PORT;


async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('[Track Service] Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false }); // Impedir a recriação de tabelas e exclusão de dados
        console.log('[Track Service] Modelos sincronizados com o banco de dados.');

        app.use('/maestro', trackRoutes);
  
        app.get('/', (req, res) => {
            res.send('[Track Service] Bem-vindo à API Maestro de Músicas do TuneCatch! 🎶');
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor de Músicas iniciado e rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('[User Service] Erro ao conectar ao banco de dados:', error);
    }
}

startServer();