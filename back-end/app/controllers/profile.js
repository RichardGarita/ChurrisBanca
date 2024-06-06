const profile = require('../services/profile');

async function getProfile(req, res) {
    try {
        const { userId } = req.query;
        console.log(req.query); // Verifica que los parámetros de consulta se reciban correctamente
        if (!userId) {
            console.log(`UserId: ${userId}`);
            res.status(400).json('All fields are required');
            return;
        }
        const result = await profile.getProfile(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

async function editProfile(req, res) {
    try {
        const { userId, username, mail, tel, picture } = req.body;
        console.log(req.body);  // Verificar los datos recibidos
        if (!userId || !(username || mail || tel || picture)) {
            console.log(`UserId: ${userId}`);
            res.status(400).json('All fields are required');
            return;
        }
        const result = await profile.editProfile(userId, username, mail, tel, picture);
        if (result)
            res.status(200).json('Edited correctly');
        else
            res.status(501).json({ error: { message: 'Something went wrong' } });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

module.exports = {
    getProfile,
    editProfile,
};