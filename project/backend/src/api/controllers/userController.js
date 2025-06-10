const userService = require('../services/userService');

const createUser = async (req, res, next) => {
    try {
        const { username, email, password, displayName, avatarURL } = req.body;

        const newUser = await userService.registerNewUser({
            username,
            email,
            password,
            displayName,
            avatarURL
        });

        res.status(201).json({
            message: 'Usuário criado com sucesso.',
            ...newUser,
        });
    }
    catch (error){
        next(error);
    }
};

module.exports = {
    createUser,
};