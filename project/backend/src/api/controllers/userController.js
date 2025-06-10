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


const login = async (req, res, next) => {
    try {
        const { credential, password } = req.body;

        const user = await userService.loginUser(credential, password);

        res.status(200).json({
            message: 'Login realizado com sucesso.',
            idUserLogged: user.idUserLogged,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    login,
};