require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { sequelize } = require('./api/models');

const userRoutes = require('./api/routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', userRoutes);

app.get('/maestro', (req, res) => {
    res.send({
        message: 'Bem-vindo ao TuneCatch API',
        version: '1.0.0',
        status: 'Servidor ativo'
    });
});

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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Servidor TuneCatch rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
})