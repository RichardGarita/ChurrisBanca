const pool = require('../../config/dbConfig');

async function getCertPath(userId) {
    try {
        if (!userId)
            return null;

        const cert = await pool.query(`SELECT * FROM CERTS WHERE ID = ?;`, userId);
        return cert[0].CERT;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getCertPath
}