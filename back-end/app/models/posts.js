const pool = require('../../config/dbConfig');

async function createPost(userId, message, picture) {
    try {

        if (!userId || !(message || picture))
            return false;

        const post = await pool.query(
            'INSERT INTO post (USER_ID_AUTHOR, MESSAGE, IMAGE) VALUES (?, ?, ?)',
            [userId, message ? message : null, picture ? picture : null]
        );

        return post;

    } catch (error) {
        throw error;
    }
}

async function getPost(postId) {
    try {
        if (!postId)
            return null;

        const post = await pool.query(`SELECT * FROM post WHERE ID = ?;`, postId);
        return post[0];
    } catch (error) {
        throw error;
    }
}

async function getPosts (usersId) {
    try {
        if (!usersId)
            return [];
        const placeholders = usersId.map(() => '?').join(', ');
        const posts = await pool.query(`SELECT * FROM post WHERE USER_ID_AUTHOR IN (${placeholders});`, usersId);
        return posts;
    } catch (error) {
        throw error;
    }
}

async function deletePost (postId) {
    try {
        if (!postId)
            return null;

        await pool.query(
            'DELETE FROM post WHERE ID = ?;',
            postId
        );
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getPost,
    getPosts,
    deletePost,
    createPost,
}