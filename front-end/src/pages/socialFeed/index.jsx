import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { PlusCircleOutlined } from '@ant-design/icons';
import {Button} from 'antd';
import AddPost from './components/addPosts';
import Modal from './components/modal';

const URL_API = 'http://localhost:4223/api/posts';
const userId = 1; // Por ahora el userId es una constante

export default function SocialFeed () {
    const [posts, setPosts] = useState([]);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const postsPerPage = 2;

    useEffect(() => {
        axios.get(`${URL_API}?userId=${userId}`).then((response) => {
            setTotalPages(Math.ceil(response.data.length/ postsPerPage));
            setPosts(response.data.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
        }).catch((error) => {
            console.error(error);
            alert('Error al obtener las publicaciones');
        })
    }, []);

    useEffect(() => {
        let startIndex = (currentPage - 1) * postsPerPage;
        let endIndex = startIndex + postsPerPage;
        setCurrentPosts(posts.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(posts.length/postsPerPage));
    }, [currentPage, posts]);

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    const handleDelete = (postId) => {
        axios.delete(`${URL_API}/${postId}?userId=${userId}`).then(() => {
            const updatedPosts = posts.filter((post) => post.id !== postId);
            setPosts(updatedPosts);
        }).catch((error) => {
            console.error(error);
            alert('Algo salió mal');
        })
    }

    const handleReaction = (postId, reaction) => {
        const data = {postId, userId, reaction};
        axios.post(`${URL_API}/likes`, data).then(() => {
            const updatedPosts = posts.map((post) => {
                if (post.id === postId) {
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
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                content={<AddPost/>}
                titulo={"Agregar Publicación"}
            />
            <section className='col-7 mx-auto text-end'>
                <Button onClick={() => setShowModal(!showModal)} className='w-auto h-auto' icon={<PlusCircleOutlined className='fs-1'/>}/>
            </section>
            {currentPosts.map((post, index) => (
                <div key={index} className='card col-7 mx-auto text-start mb-1'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-6'>
                                <small className="card-subtitle text-body-secondary">{post.timestamp}</small>
                                <div>
                                    <h5 className='card-title mb-1 d-inline'>{post.username}</h5>
                                    <small className="card-subtitle text-body-secondary ms-1">{post.relation}</small>
                                </div>
                            </div>
                            <div className='col-3 ms-auto text-end'>
                                {Number(post.user_id) === userId && (
                                    <button className='btn btn-danger' onClick={() => handleDelete(post.id)}>Borrar</button>
                                )}
                            </div>
                        </div>
                        <p className="card-text mb-1">{post.message}</p>

                        <img className='img-fluid card-image-bottom' src={post.picture} alt='No se cargó bien la imagen'></img>

                        <section className='mt-1'>
                            <button className={`btn btn-primary me-1 ${post.liked ? 'active' : ''}`} onClick={() => handleReaction(post.id, true)}>
                                {post.likes > 0 ? <small className='me-2'>{post.likes}</small> : ''}
                                {post.liked ? 'Te gusta': 'Dar me gusta'}
                            </button>
                            <button className={`btn btn-danger ${post.disliked ? 'active' : ''}`} onClick={() => handleReaction(post.id, false)}>
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