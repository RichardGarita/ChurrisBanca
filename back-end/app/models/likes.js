const pool = require('../../config/dbConfig');

async function getLikes(postsId) {
    try {
        if (postsId.length <= 0)
            return [];

        const placeholders = postsId.map(() => '?').join(', ');
        const likes = await pool.query(
            `SELECT POST_ID, USER_LIKER_ID, VALUE FROM LIKES WHERE POST_ID IN (${placeholders});`,
            postsId
        );
        return likes;
    } catch (error) {
        throw error;
    }
}

async function getLike(postId, userId) {
    try {
        if (!postId || !userId)
            return null;

        const like = await pool.query(
            'SELECT * FROM LIKES WHERE POST_ID = ? AND USER_LIKER_ID = ?',
            [postId, userId]
        )

        return like[0];
    } catch (error) {
        throw error;
    }
}

async function updateLike(value, postId, userId) {
    try {
        if (!postId || !userId)
            return null;

        await pool.query(
            'UPDATE LIKES SET VALUE = ? WHERE POST_ID = ? AND USER_LIKER_ID = ?',
            [value, postId, userId]
        )
    } catch (error) {
        throw error;
    }
}

async function addLike(value, postId, userId) {
    try {
        if (!postId || !userId)
            return null;

        await pool.query(
            'INSERT INTO LIKES (VALUE, POST_ID, USER_LIKER_ID) VALUES (?, ?, ?)',
            [value, postId, userId]
        );
    } catch (error) {
        throw error;
    }
}

async function deleteLike(postId, userId) {
    try {
        if (!postId || !userId)
            return null;

        await pool.query(
            'DELETE FROM likes WHERE POST_ID = ? AND USER_LIKER_ID = ?',
            [postId, userId]
        );
    } catch (error) {
        throw error;
    }
}

async function deletePostLikes(postId) {
    try {
        if (!postId)
            return null;

        await pool.query(
            'DELETE FROM likes WHERE post_id = ?;',
            postId
        );
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getLikes,
    getLike,
    updateLike,
    addLike,
    deleteLike,
    deletePostLikes,
}