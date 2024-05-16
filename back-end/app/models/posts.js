const pool = require('../../config/dbConfig');

async function getPosts (usersId) {
    try {
        if (!usersId)
            return [];
        const placeholders = usersId.map(() => '?').join(', ');
        const posts = await pool.query(`SELECT * FROM post WHERE user_id IN (${placeholders});`, usersId);
        return posts;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getPosts,
}