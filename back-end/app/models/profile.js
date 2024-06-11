const pool = require('../../config/dbConfig');

async function getProfile(userId) {
    try {
        if (!userId)
            return null;

        const profile = await pool.query(`SELECT USERNAME, MAIL, TEL, PICTURE FROM user WHERE id = ?;`, userId);
        return profile[0];
    } catch (error) {
        throw error;
    }
}

async function editProfile(userId, username, mail, tel, picture) {
    try {
        if (!userId || !(username || mail || tel || picture)) return null;
        await pool.query(`
            UPDATE user
            SET USERNAME = ?, MAIL = ?, TEL = ?, PICTURE = ?
            WHERE ID = ?`, 
            [username, mail, tel, picture, userId]
        );
        return true;
    } catch (error) {
        throw error;
    }
}

async function getUserId(username, password) {
    try {
        if (!username || !password)
            return null;

        const userId = await pool.query(`SELECT ID FROM USER
            WHERE USERNAME = ? AND PASSWORD = ?;
            `, [username, password]);
        return userId[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getProfile,
    editProfile,
    getUserId,
}