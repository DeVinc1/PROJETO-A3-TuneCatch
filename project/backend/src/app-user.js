require('dotenv').config();
const express = require('express');
const { sequelize } = require('./api/models');
const { errorHandler } = require('./utils/errorUtils'); 
const userRoutes = require('./api/routes/userRoutes');

const app = express();
app.use(express.json());
const PORT = process.env.USER_PORT;


async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('[User Service] Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false }); // Impedir a recriação de tabelas e exclusão de dados
        console.log('[User Service] Modelos sincronizados com o banco de dados.');

        app.use('/maestro', userRoutes);
  
        app.get('/', (req, res) => {
            res.send('[User Service] Bem-vindo à API Maestro de Usuários do TuneCatch! 🎶');
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor de Usuários iniciado e rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('[User Service] Erro ao conectar ao banco de dados:', error);
    }
}

startServer();