const Post = require('../models/posts');
const User = require('../models/user');
const Likes = require('../models/likes');

async function getSocialFeedPosts(userId) {

    try {
        if (!userId)
            return;

        const friends = await User.getFriends(userId);
        const friendsIds = friends.map((friend) => friend.friend_id);

        const followed = await User.getFollowed(userId);
        const followedIds = followed.map((following) => following.followed_id);

        const followedAndFriendsIds = [...new Set([...followedIds, ...friendsIds, userId])];

        if (followedAndFriendsIds.length <= 0)
            return [];

        const followedAndFriends = await User.getUser(followedAndFriendsIds);
        
        const posts = await Post.getPosts(followedAndFriendsIds);
        const postsId = posts.map((post) => post.id);

        const likes = await Likes.getLikes(postsId);


        const formatedPosts = posts.map((post) => {
            // Filtrar los likes para esta publicación específica
            const postLikes = likes.filter((like) => like.post_id === post.id);

            // Separar los likes y los dislikes
            const likesCount = postLikes.filter((like) => like.value === 1).length;
            const dislikesCount = postLikes.filter((like) => like.value === 0).length;

            // Verificar si el usuario actual ha dado like a esta publicación
            const userLiked = postLikes.some((like) => like.user_id_liker === userId && like.value === 1);
            const userDisliked = postLikes.some((like) => like.user_id_liker === userId && like.value === 0);


            // Encontrar el nombre de usuario correspondiente
            const user = followedAndFriends.find((user) => user.ID === post.user_id);

            // Ver si son amigos o si sole es seguido
            const relation = userId === post.user_id ? 'Tú' : (friendsIds.includes(post.user_id) ? 'Son Amigos' : 'Lo sigues');

            return { 
                ...post,
                username: user.username,
                likes: likesCount,
                dislikes: dislikesCount,
                liked: userLiked,
                disliked: userDisliked,
                relation: relation
            };
        });

        return formatedPosts;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addLike(postId, userId, reaction) {
    try {
        if (!postId || !userId || typeof reaction !== 'boolean')
            return false;

        const like = await Likes.getLike(postId, userId);

        if (like) {
            if (like.value !== Number(reaction))
                await Likes.updateLike(reaction, postId, userId);
            else
                await Likes.deleteLike(postId, userId);
        } else {
            await Likes.addLike(reaction, postId, userId);
        }

        return true;

    } catch(error) {
        console.error(error);
        throw error;
    }
}

async function deletePost(postId, userId) {
    return true;
}

module.exports = {
    getSocialFeedPosts,
    addLike,
    deletePost
}