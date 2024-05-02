import React, {useState, useEffect} from 'react';
import axios from 'axios';

const URL_API = 'http://localhost:4223/api/posts';
const userId = 2; // Por ahora el userId es una constante

export default function SocialFeed () {
    const [posts, setPosts] = useState([]);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const postsPerPage = 2;

    useEffect(() => {
        axios.get(`${URL_API}?userId=${userId}`).then((response) => {
            setTotalPages(Math.ceil(response.data.length/ postsPerPage));
            setPosts(response.data.sort((a, b) => a.date.localeCompare(b.date)));
        }).catch((error) => {
            console.error(error);
            alert('Error al obtener las publicaciones');
        })
    }, []);

    useEffect(() => {
        let startIndex = (currentPage - 1) * postsPerPage;
        let endIndex = startIndex + postsPerPage;
        setCurrentPosts(posts.slice(startIndex, endIndex)); 
    }, [currentPage, posts]);

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    const handleReaction = (postId, reaction) => {
        const data = {postId, userId};
        axios.post(`${URL_API}/${reaction ? 'likes' : 'dislikes'}`, data).then(() => {
            const updatedPosts = posts.map((post) => {
                if (post.postId === postId) {
                    if (reaction) {
                        if (post.disliked)
                            post.dislikes--;
                        post.liked = !post.liked;
                        post.likes = post.liked ? post.likes + 1: post.likes - 1;
                        post.disliked = false;
                    } else {
                        if (post.liked)
                            post.likes--;
                        post.disliked = !post.disliked;
                        post.dislikes = post.disliked ? post.dislikes + 1: post.dislikes - 1;
                        post.liked = false;
                    }
                }
                return post;
            });
            setPosts(updatedPosts);
        }).catch((error) => {
            console.error(error);
            alert('Error al reaccionar a la publicación');
        })
    }


    return (
        <>
            {currentPosts.map((post, index) => (
                <div key={index} className='card col-7 mx-auto text-start mb-1'>
                    <div className='card-body'>
                        <small className="card-subtitle mb-2 text-body-secondary">{post.date}</small>
                        <h5 className='card-title'>{post.author}</h5>
                        <small className="card-subtitle mb-2 text-body-secondary d-block">{post.relation}</small>
                        <p className="card-text">{post.content}</p>

                        <img className='img-fluid card-image-bottom' src={post.picture} alt='No se cargó bien la imagen'></img>

                        <section className='mt-1'>
                            <button className={`btn btn-primary me-1 ${post.liked ? 'active' : ''}`} onClick={() => handleReaction(post.postId, true)}>
                                {post.likes > 0 ? <small className='me-2'>{post.likes}</small> : ''}
                                {post.liked ? 'Te gusta': 'Dar me gusta'}
                            </button>
                            <button className={`btn btn-danger ${post.disliked ? 'active' : ''}`} onClick={() => handleReaction(post.postId, false)}>
                                {post.dislikes > 0 ? <small className='me-2'>{post.dislikes}</small> : ''}
                                {post.disliked ? 'No te gusta': 'Dar no me gusta'}
                            </button>
                        </section>
                    </div>
                </div>
            ))}

            <nav>
                <ul className="pagination justify-content-center">
                    <li key={'prev'} className="page-item">
                        <span onClick={() => goToPage(Math.max(currentPage-1, 1))} className="page-link">&laquo;</span>
                    </li>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((i) => (
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                            <span onClick={() => goToPage(i)} className="page-link">{i}</span>
                        </li>
                    ))}
                    <li key={'next'} className="page-item">
                        <span onClick={() => goToPage(Math.min(currentPage+1, totalPages))} className="page-link">&raquo;</span>
                    </li>
                </ul>
            </nav>
        </>
    ) 
}