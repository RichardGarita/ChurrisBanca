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

async function isLiked(postId, userId) {
    
}

module.exports = {
    getLikes,
}