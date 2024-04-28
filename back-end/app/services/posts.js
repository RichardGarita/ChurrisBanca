async function getSocialFeedPosts(userId) {
    return [
        {
            postId: 1,
            author: 'Jenna Doe',
            relation: 'Le sigues',
            content: 'Soy un texto dummy',
            picture: 'blob',
            liked: true,
            disliked: false,

        },
        {
            postId: 2,
            author: 'Jhon Doe',
            relation: 'Son amigos',
            content: 'Soy un texto dummy 2',
            picture: 'blob',
            liked: false,
            disliked: false,

        },
        {
            postId: 3,
            author: 'Peter Doe',
            relation: 'Le sigues',
            content: 'Soy un texto dummy por 3',
            picture: 'blob',
            liked: false,
            disliked: true,

        },
    ]
}

async function addLike(postId, userId) {
    return true;
}

async function addDislike(postId, userId) {
    return true;
}

module.exports = {
    getSocialFeedPosts,
    addLike,
    addDislike
}