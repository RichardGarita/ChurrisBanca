const User = require('../models/user');

async function getFriends (userId) {
    try {
        if (!userId)
            return;

        const friends = await User.getFriends(userId);
        if (friends.length <= 0)
            return [];

        const friends_data = await User.getUser(friends.map((friend) => friend.friend_id));
        if (friends_data.length > 0)
            return friends_data.map((friend) => {
                return {friend_username: friend.USERNAME, friend_id: friend.ID};
            });
        else
            return [];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function followUser (userId, toFollowUsername) {
    try {
        if (!userId || !toFollowUsername)
            return;

        const toFollow = await User.getUserIdByUsername(toFollowUsername);
        if(!toFollow)
            throw new Error('Did not found user to follow');

        const itFollows = await User.verifyFollowed(userId, toFollow);
        if (itFollows)
            throw new Error('You already follow this person');

        const youFriends = await User.verifyFriends(userId, toFollow);
        if (youFriends)
            throw new Error('You already follow this person');


        await User.followUser(userId, toFollow);

        const bothFollows = await User.verifyFollowed(toFollow, userId);
        if (bothFollows) 
            await User.makeFriends(userId, toFollow);

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getFollowed(userId) {
    try {
        if (!userId)
            return;

        const followedIds = await User.getFollowed(userId);
        const followed = await User.getUser(followedIds.map((following) => following.followed_id));

        return followed.map((following) => {
            return {
                username: following.USERNAME,
                id: following.ID
            }
        })
    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function unfollowUser(userId, toUnFollow) {
    try {
        if (!userId || !toUnFollow)
            return;

        const itFollows = await User.verifyFollowed(userId, toUnFollow);
        if (!itFollows)
            throw new Error('You do not follow this person');

        await User.unfollowUser(userId, toUnFollow);

        const youFriends = await User.verifyFriends(userId, toUnFollow);
        if (youFriends) {
            await User.unMakeFriends(userId, toUnFollow);
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getFriends,
    followUser,
    getFollowed,
    unfollowUser
}