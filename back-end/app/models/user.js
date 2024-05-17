const pool = require('../../config/dbConfig');

async function getUser(usersId) {
    try {
        if (!usersId)
            return [];

        const placeholders = usersId.map(() => '?').join(', ');
        const user = await pool.query(`SELECT * FROM user WHERE ID IN (${placeholders});`, usersId);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getFriends(userId) {
    try {
        if (!userId)
            return [];

        const friends = await pool.query(
            'SELECT ' +
            '   CASE ' + 
            '       WHEN USER_ID_OWNER = ? THEN USER_ID_FRIEND ' +
            '       ELSE USER_ID_OWNER ' +
            '   END AS friend_id ' +
            'FROM friends ' +
            'WHERE USER_ID_OWNER = ? OR USER_ID_FRIEND = ?;',
            [userId, userId, userId]
        );

        return friends;
    } catch (error) {
        throw error;
    }
}

async function getFollowed(userId) {
    try {
        if (!userId)
            return [];

        const followed = await pool.query(
            'SELECT USER_ID_OWNER as followed_id FROM follow WHERE USER_ID_FOLLOWER = ?',
            userId
        );

        return followed;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getUser,
    getFriends,
    getFollowed,
}