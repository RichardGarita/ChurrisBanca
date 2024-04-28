import React, {useState, useEffect} from 'react';
import axios from 'axios';

const URL_API = 'http://localhost:4223/api/posts';
const userId = 2; // Por ahora el userId es una constante

export default function SocialFeed () {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get(`${URL_API}?userId=${userId}`).then((response) => {
            setPosts(response.data);
        }).catch((error) => {
            console.error(error);
            alert('Error al obtener las publicaciones');
        })
    }, []);

    const handleReaction = (postId, reaction) => {
        const data = {postId, userId};
        axios.post(`${URL_API}/${reaction ? 'likes' : 'dislikes'}`, data).then(() => {
            const updatedPosts = posts.map((post) => {
                if (post.postId === postId) {
                    if (reaction) {
                        post.liked = !post.liked;
                        post.disliked = false;
                    } else {
                        post.disliked = !post.disliked;
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
            {posts.map((post, index) => (
                <div key={index} className='card col-7 mx-auto text-start mb-1'>
                    <div className='card-body'>
                        <h5 className='card-title me-auto'>{post.author}</h5>
                        <h6 className="card-subtitle mb-2 text-body-secondary">{post.relation}</h6>
                        <p className="card-text">{post.content}</p>

                        <img className='img-fluid card-image-bottom' src={post.picture} alt='No se cargó bien la imagen'></img>

                        <section className='mt-1'>
                            <button className={`btn btn-primary me-1 ${post.liked ? 'active' : ''}`} onClick={() => handleReaction(post.postId, true)}>{post.liked ? 'Te gusta': 'Dar me gusta'}</button>
                            <button className={`btn btn-danger ${post.disliked ? 'active' : ''}`} onClick={() => handleReaction(post.postId, false)}>{post.disliked ? 'No te gusta': 'Dar no me gusta'}</button>
                        </section>
                    </div>
                </div>
            ))}
        </>
    ) 
}