const Login = require('../models/login');

async function loginService(userId, password) {
    try {

        if (!userId || !password)
            return false;

        const login = await Login.checkLogin(userId, password);

        return login;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    loginService
}