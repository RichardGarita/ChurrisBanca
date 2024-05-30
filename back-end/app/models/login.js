const pool = require('../../config/dbConfig');
const { use } = require('../routes/login');

async function checkLogin(userId, password) {
    try {
        if (!userId)
            return null;

        const userData = await pool.query(`SELECT * FROM user WHERE username = ?;`, userId);
        if (userData[0].PASSWORD == password){
            return true;
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