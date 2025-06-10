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
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false }); // Impedir a recriação de tabelas e exclusão de dados
        console.log('Modelos sincronizados com o banco de dados.');

        app.use('/maestro', userRoutes);
  
        app.get('/', (req, res) => {
            res.send('Bem-vindo à API Maestro do TuneCatch! 🎶');
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor iniciado rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

startServer();