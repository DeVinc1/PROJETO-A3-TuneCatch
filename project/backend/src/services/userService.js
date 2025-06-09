const { User } = require('../models/User.js');
const { hashPassword, verifyPassword } = require('../utils/authUtils.js');

class ValidationError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = 'ValidationError';
        this.details = details;
        this.statusCode = 400; // Bad Request
    }
}

class ConflictError extends Error {
    constructor(message, conflictField = '') {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409; // Conflict
    }
}

//POST - Criar um Usuário
async function createUser(userData) {
    const { username, email, password, displayName, avatarURL } = userData;

    if (!username || username.trim() === '') {
        throw new ValidationError('Campos obrigatórios não preenchidos', { username: 'O campo username é obrigatório.' });
    }
    if (!email || email.trim() === '') {
        throw new ValidationError('Campos obrigatórios não preenchidos', { email: 'O campo email é obrigatório.' });
    }
    if (!password || password.trim() === '') {
        throw new ValidationError('Campos obrigatórios não preenchidos', { password: 'O campo password é obrigatório.' });
    }

    if (password.length < 6) {
        throw new ValidationError('Validação de campos falhou', { password: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
        throw new ConflictError('Recurso já existente', 'username', `O username "${username}" já está em uso.`);
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        throw new ConflictError('Recurso já existente', 'email', `O email "${email}" já está em uso.`);
    }

    const passwordHash = await hashPassword(password);

    try {
        const newUser = await User.create({
            username,
            email,
            passwordHash,
            displayName,
            avatarURL,
            isBanned: false, // Redudância para evitar problemas - já é definido como false no modelo
            isAdmin: false, // Redudância para evitar problemas - já é definido como false no modelo
        });

        return {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            displayName: newUser.displayName,
            avatarURL: newUser.avatarURL,
            dataCreated: newUser.dataCreated,
        };
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const details = {};
            error.errors.forEach(err => {
                details[err.path] = err.message;
            });
            throw new ValidationError('Validação de campos falhou', details);
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            const conflictField = error.errors[0]?.path || 'unknown';
            throw new ConflictError('Recurso já existente', conflictField, `O campo "${conflictField}" já está em uso.`);
        }

        console.error('Erro ao criar usuário:', error);
        throw new Error('Erro ao criar usuário: ' + error.message);
    }
}

module.exports = {
    createUser,
    ValidationError,
    ConflictError,
};
