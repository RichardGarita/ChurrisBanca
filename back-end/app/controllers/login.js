const loginService = require("../services/login");

const { generateJWT } = require("../jsonWT");

async function login(req, res) {
    try {
        const { userId, password } = req.body;
        console.log(req.body);
        if (!userId || !password) {
            console.log(`UserId: ${userId}, password: ${password}`);
            res.status(400).json("All fields are required");
            return;
        }
        const result = await loginService.loginService(userId, password);
        if (result) {
            res.status(200).json({ auth: true });
        } else
            res.status(501).json({
                auth: false,
                error: { message: "Something went wrong" },
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ auth: false, error });
    }
}

async function Reallogin(req, res) {
    try {
        const { token, userId, password } = req.body;
        //console.log(req.body);
        if (!userId || !password || !token) {
            //console.log(`UserId: ${userId}, password: ${password}`);
            res.status(400).json("All fields are required");
            return;
        }
        const result = await loginService.RealloginService(token, userId, password);
        if (result) {
            const token = generateJWT(result);
            res.status(200).json({ auth: true, token });
        } else
            res.status(501).json({
                auth: false,
                error: { message: "Something went wrong" },
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ auth: false, error });
    }
}

module.exports = {
    login,
    Reallogin
};
