const pool = require('../../config/dbConfig');

async function checkLogin(userId, password) {
    try {
        if (!userId)
            return null;

        const userData = await pool.query(`SELECT * FROM user WHERE username = ?;`, userId);
        if (userData[0].PASSWORD == password){
            return userData[0].ID;
        } else{
            return false;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkLogin,
}