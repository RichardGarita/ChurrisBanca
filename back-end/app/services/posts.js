const Post = require('../models/posts');
const User = require('../models/user');
const Likes = require('../models/likes');

async function createPost(userId, message, picture) {
    try {

        if (!userId || !(message || picture))
            return false;

        const post = await Post.createPost(userId, message, picture);

        return post;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

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
        if (posts.length <= 0)
            return [];
        const postsId = posts.map((post) => post.ID);

        const likes = await Likes.getLikes(postsId);


        const formatedPosts = posts.map((post) => {
            // Filtrar los likes para esta publicación específica
            const postLikes = likes.filter((like) => like.POST_ID === post.ID);

            // Separar los likes y los dislikes
            const likesCount = postLikes.filter((like) => like.VALUE === 1).length;
            const dislikesCount = postLikes.filter((like) => like.VALUE === 0).length;

            // Verificar si el usuario actual ha dado like a esta publicación
            const userLiked = postLikes.some((like) => like.USER_LIKER_ID === Number(userId) && like.VALUE === 1);
            const userDisliked = postLikes.some((like) => like.USER_LIKER_ID === Number(userId) && like.VALUE === 0);


            // Encontrar el nombre de usuario correspondiente
            const user = followedAndFriends.find((user) => user.ID === post.USER_ID_AUTHOR);

            // Ver si son amigos o si sole es seguido
            const relation = Number(userId) === post.USER_ID_AUTHOR ? 'Tú' : (friendsIds.includes(post.USER_ID_AUTHOR) ? 'Son Amigos' : 'Le sigues');

            var image = post.IMAGE;
            

            if (post.IMAGE) {
                image = atob(post.IMAGE.toString('base64'));
            }

            return { 
                ...post,
                IMAGE: image,
                username: user.USERNAME,
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
            if (like.VALUE !== Number(reaction))
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
    try {
        if (!postId || !userId)
            return false;
        const post = await Post.getPost(postId);
        if (!post)
            return false;

        await Likes.deletePostLikes(post.ID);
        await Post.deletePost(post.ID);

        return true;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getSocialFeedPosts,
    addLike,
    deletePost,
    createPost
}