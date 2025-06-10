const { get } = require('../routes/userRoutes');
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
    catch (error) {
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

const getUserByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserDetails(id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getUserByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await userService.getUserDetailsByUsername(username);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createUser,
    login,
    getUserByID,
    getUserByUsername
};