const posts = require('../services/posts'); 

async function createPost(req, res) {
    try {
        const {message, userId, picture} = req.body;
        if (!userId || !(message || picture)) {
            console.log(`UserId: ${userId}, message: ${message}, picture: ${picture}`);
            res.status(400).json('All fields are required');
            return
        }
        const result = await posts.createPost(userId, message, picture);
        if(result)
            res.status(200).json('Created correctly');
        else
            res.status(501).json({error: {message: 'Something went wrong'}});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

async function getSocialFeedPosts(req, res){
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await posts.getSocialFeedPosts(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function addLike(req, res) {
    try {
        const {postId, userId, reaction} = req.body;
        if (!postId || !userId || typeof reaction !== 'boolean') {
            res.status(400).json('All fields are required');
            return
        }
        const added = await posts.addLike(postId, userId, reaction);
        if (added)
            res.status(200).json('Like added correctly');
        else
            res.status(501).json('Something went wrong');
    } catch (error) {
        res.status(500).json(error);
    }

}

async function deletePost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.query.userId;
        if (!postId || !userId) {
            res.status(400).json('All fields are required');
            return
        }
        const added = await posts.deletePost(postId, userId);
        if (added)
            res.status(200).json('Deleted correctly');
        else
            res.status(501).json('Something went wrong');
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

module.exports = {
    getSocialFeedPosts,
    addLike,
    deletePost,
    createPost,
}