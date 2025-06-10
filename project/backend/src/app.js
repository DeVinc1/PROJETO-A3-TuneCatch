require('dotenv').config();
const { sequelize } = require('./api/models');

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false }); // Impedir a recriação de tabelas e exclusão de dados
        console.log('Modelos sincronizados com o banco de dados.');

        /* 
        Rotas e controllers
        */
        console.log('Servidor iniciado.');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

startServer();