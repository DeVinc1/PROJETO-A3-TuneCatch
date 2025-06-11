const bcrypt = require('bcryptjs');

const saltRounds = 10;

async function hashPassword(password) {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Erro ao hashear a senha: ' + error.message);
    }
}

async function verifyPassword(password, hash) {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        throw new Error('Erro ao verificar a senha: ' + error.message);
    }
}

module.exports = {
    hashPassword,
    verifyPassword,
};