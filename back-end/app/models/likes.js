const pool = require('../../config/dbConfig');

async function getLikes(postsId) {
    try {
        if (!postsId)
            return [];

        const placeholders = postsId.map(() => '?').join(', ');
        const likes = await pool.query(
            `SELECT post_id, user_id_liker, value FROM likes WHERE post_id IN (${placeholders});`,
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
            'SELECT * FROM likes WHERE post_id = ? AND user_id_liker = ?',
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
            'UPDATE likes SET value = ? WHERE post_id = ? AND user_id_liker = ?',
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
            'INSERT INTO likes (value, post_id, user_id_liker) VALUES (?, ?, ?)',
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
            'DELETE FROM likes WHERE post_id = ? AND user_id_liker = ?',
            [postId, userId]
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
}