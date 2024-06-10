const posts = require('../services/posts'); 

async function createPost(req, res) {
    try {
        const {message, picture} = req.body;
        const userId = req.user.ID;
        console.log(userId);
        if (!userId || !(message || picture)) {
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
        const userId = req.user.ID;
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
        const {postId, reaction} = req.body;
        const userId = req.user.ID;
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
        const userId = req.user.ID;
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