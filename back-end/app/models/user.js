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

async function getUserIdByUsername(username) {
    try {
        if (!username)
            0;
        const user = await pool.query(`SELECT * FROM USER WHERE USERNAME = ?;`, username);
        return user[0].ID;
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

async function verifyFollowed (follower, followed) {
    try {
        if (!followed || !follower)
            return false;

        const itFollows = await pool.query(
            'SELECT * FROM follow WHERE USER_ID_FOLLOWER = ? AND USER_ID_OWNER = ?',
            [follower, followed]
        );
        if (itFollows.length > 0)
            return true;

        return false;
    } catch (error) {
        throw error;
    }
}

async function verifyFriends(userId, friendId) {
    try {
        if (!userId || !friendId)
            return [];

        const friends = await pool.query(
            'SELECT * ' +
            'FROM FRIENDS ' +
            'WHERE (USER_ID_OWNER = ? AND USER_ID_FRIEND = ?) OR (USER_ID_FRIEND = ? AND USER_ID_OWNER = ?);',
            [userId, friendId, userId, friendId]
        );

        if (friends.length > 0)
            return true;

        return false;
    } catch (error) {
        throw error;
    }
}

async function followUser(userId, toFollow) {
    try {
        if (!userId || !toFollow)
            return [];

        await pool.query(
            'INSERT INTO follow (USER_ID_OWNER, USER_ID_FOLLOWER) VALUES(?, ?)',
            [toFollow, userId]
        );

        return true;
    } catch (error) {
        throw error;
    }
}

async function unfollowUser(userId, toUnfollow) {
    try {
        if (!userId || !toUnfollow)
            return [];

        await pool.query(
            'DELETE FROM FOLLOW WHERE USER_ID_OWNER = ? AND USER_ID_FOLLOWER = ?',
            [toUnfollow, userId]
        );

        return true;
    } catch (error) {
        throw error;
    }
}

async function makeFriends(userId, friendId) {
    try {
        if (!userId || !toFollow)
            return [];

        await pool.query(
            'INSERT INTO FRIENDS (USER_ID_OWNER, USER_ID_FRIEND) VALUES(?, ?)',
            [userId, friendId]
        );

        return true;
    } catch (error) {
        throw error;
    }
}

async function unMakeFriends(userId, friendId) {
    try {
        if (!userId || !toFollow)
            return [];

        await pool.query(
            'DELETE FROM FRIENDS WHERE (USER_ID_OWNER = ? AND USER_ID_FRIEND = ?) OR (USER_ID_FRIEND = ? AND USER_ID_OWNER = ?);',
            [userId, friendId, userId, friendId]
        );

        return true;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getUser,
    getUserIdByUsername,
    getFriends,
    getFollowed,
    verifyFollowed,
    verifyFriends,
    followUser,
    makeFriends,
    unfollowUser,
    unMakeFriends
}