const Profile = require('../models/profile');
const User = require('../models/user');

async function getProfile(userId) {
    try {
        if (!userId) return false;
        const profile = await Profile.getProfile(userId);
        if (profile.PICTURE != null) {
            picture = atob(profile.PICTURE.toString('base64'));
            profile.PICTURE = picture;
        }
        return profile;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function editProfile(userId, username, mail, tel, picture) {
    try {
        if (!userId || !(username || mail || tel || picture)) return false;
        const editProfile = await Profile.editProfile(userId, username, mail, tel, picture);
        return editProfile;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getUserId(username, password) {
    try {
        if (!username || !password) return false;
        const UserId = await Profile.getUserId(username, password);
        return UserId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function isFriend(userId, otherUserId) {
    try {
        if (!userId || !otherUserId) return false;
        const friends = await User.getFriends(userId);

        const friendExists = friends.some((friend) => friend.friend_id === Number(otherUserId));
        
        return friendExists;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getProfile,
    editProfile,
    getUserId,
    isFriend
};
