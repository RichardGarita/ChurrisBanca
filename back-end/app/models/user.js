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
            '       WHEN user_id1 = ? THEN user_id2 ' +
            '       ELSE user_id1 ' +
            '   END AS friend_id ' +
            'FROM friends ' +
            'WHERE user_id1 = ? OR user_id2 = ?;',
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
            'SELECT user_id_followed as followed_id FROM follows WHERE user_id_follower = ?',
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