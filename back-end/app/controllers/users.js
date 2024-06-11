const users = require('../services/users'); 

async function getFriends(req, res){
    try {
        const userId = req.user.ID;
        if (!userId) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await users.getFriends(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

async function followUser(req, res) {
    try {
        const userId = req.user.ID;
        const {toFollow} = req.body;
        if (!userId || !toFollow) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await users.followUser(userId, toFollow);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        if (error.message === 'Did not found user to follow')
            res.status(404).json(error);
        else if (error.message === 'You already follow this person')
            res.status(402).json(error);
        else
            res.status(500).json(error);
    }
}

async function getFollowed (req, res) {
    try {
        const userId = req.user.ID;
        if (!userId) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await users.getFollowed(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}
async function unfollowUser(req, res){
    try {
        const userId = req.user.ID;
        const {toUnfollow} = req.body;
        if (!userId || !toUnfollow) {
            console.log(`\n\n\nHere: ${userId} ${toUnfollow}\n\n\n`);
            res.status(400).json('All fields are required');
            return
        }
        const result = await users.unfollowUser(userId, toUnfollow);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Did not found user to unfollow')
            res.status(404).json(error);
        else if (error.message === 'You do not follow this person')
            res.status(402).json(error);
        else
            res.status(500).json(error);
    }
}

module.exports = {
    getFriends,
    followUser,
    getFollowed,
    unfollowUser,
}