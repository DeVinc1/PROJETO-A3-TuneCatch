require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./api/models');
const { errorHandler } = require('./utils/errorUtils');
const tagRoutes = require('./api/routes/tagRoutes');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Permita requisições apenas frontend vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
const PORT = process.env.TAG_PORT; 


async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('[Tag Service] Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false }); // Impedir a recriação de tabelas e exclusão de dados
        console.log('[Tag Service] Modelos sincronizados com o banco de dados.');

        app.use('/maestro', tagRoutes);
  
        app.get('/', (req, res) => {
            res.send('[Tag Service] Bem-vindo à API Maestro de Tags do TuneCatch! 🎶');
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor de Tags iniciado e rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('[Tag Service] Erro ao conectar ao banco de dados:', error);
    }
}

startServer();