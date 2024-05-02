async function getSocialFeedPosts(userId) {
    return [
        {
            postId: 1,
            author: 'Jenna Doe',
            date: '12-05-2024',
            relation: 'Le sigues',
            content: 'Soy un texto dummy',
            picture: 'blob',
            liked: true,
            disliked: false,
            likes: 3,
            dislikes: 2,

        },
        {
            postId: 2,
            author: 'Jhon Doe',
            date: '08-05-2024',
            relation: 'Son amigos',
            content: 'Soy un texto dummy 2',
            picture: 'blob',
            liked: false,
            disliked: false,
            likes: 4,
            dislikes: 0,

        },
        {
            postId: 3,
            author: 'Peter Doe',
            date: '12-06-2024',
            relation: 'Le sigues',
            content: 'Soy un texto dummy por 3',
            picture: 'blob',
            liked: false,
            disliked: true,
            likes: 1,
            dislikes: 1,

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