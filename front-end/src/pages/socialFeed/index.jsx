import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircleOutlined, UserOutlined, BankOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import AddPost from './components/addPosts';
import Modal from './components/modal';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import AuthToken from '../../config/config';

const URL_API = 'http://localhost:4223/api/posts';

export default function SocialFeed() {
    const [posts, setPosts] = useState([]);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    if (!token)
        window.location.replace('/');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.ID;

    const postsPerPage = 2;

    useEffect(() => {
        AuthToken(token);
        axios.get(URL_API).then((response) => {
            setTotalPages(Math.ceil(response.data.length / postsPerPage));
            setPosts(response.data.sort((a, b) => a.TIMESTAMP.localeCompare(b.TIMESTAMP)));
        }).catch((error) => {
            console.error(error);
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                alert('Sesión Expirada');
                window.location.replace('/');
            } else {
                alert('Error al obtener las publicaciones');
            }
        });
    }, [token]);

    useEffect(() => {
        let startIndex = (currentPage - 1) * postsPerPage;
        let endIndex = startIndex + postsPerPage;
        setCurrentPosts(posts.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(posts.length / postsPerPage));
    }, [currentPage, posts]);

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    const handleDelete = (postId) => {
        AuthToken(token);
        axios.delete(`${URL_API}/${postId}`).then(() => {
            const updatedPosts = posts.filter((post) => post.ID !== postId);
            setPosts(updatedPosts);
        }).catch((error) => {
            console.error(error);
            alert('Algo salió mal');
        });
    }

    const handleReaction = (postId, reaction) => {
        const data = { postId, reaction };
        AuthToken(token);
        axios.post(`${URL_API}/likes`, data).then(() => {
            const updatedPosts = posts.map((post) => {
                if (post.ID === postId) {
                    if (reaction) {
                        if (post.disliked)
                            post.dislikes--;
                        post.liked = !post.liked;
                        post.likes = post.liked ? post.likes + 1 : post.likes - 1;
                        post.disliked = false;
                    } else {
                        if (post.liked)
                            post.likes--;
                        post.disliked = !post.disliked;
                        post.dislikes = post.disliked ? post.dislikes + 1 : post.dislikes - 1;
                        post.liked = false;
                    }
                }
                return post;
            });
            setPosts(updatedPosts);
        }).catch((error) => {
            console.error(error);
            alert('Error al reaccionar a la publicación');
        });
    }

    const handleProfileClick = () => {
        navigate('/self-profile');
    }

    return (
        <>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                size={'lg'}
                content={<AddPost />}
                titulo={"Agregar Publicación"}
            />
            <section className='col-7 mx-auto text-end'>
                <Button onClick={() => setShowModal(!showModal)} className='w-auto h-auto' icon={<PlusCircleOutlined className='fs-1' />} />
                <Button onClick={handleProfileClick} className='w-auto h-auto ms-2' icon={<UserOutlined className='fs-1' />} />
                <Button onClick={() => window.location.href = '/bank-feed'} className='w-auto h-auto ms-2' icon={<BankOutlined className='fs-1' />} />
            </section>
            {posts.length <= 0 && (<h3>No hay publicaciones</h3>)}
            {currentPosts.map((post, index) => (
                <div key={index} className='card col-7 mx-auto text-start mb-1'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-6'>
                                <small className="card-subtitle text-body-secondary">{post.TIMESTAMP}</small>
                                <div>
                                    <h5 onClick={() => window.location.href = `/others-profile/${post.USER_ID_AUTHOR}`} className='card-title mb-1 d-inline onClick'>{post.username}</h5>
                                    <small className="card-subtitle text-body-secondary ms-1">{post.relation}</small>
                                </div>
                            </div>
                            <div className='col-3 ms-auto text-end'>
                                {Number(post.USER_ID_AUTHOR) === userId && (
                                    <button className='btn btn-danger' onClick={() => handleDelete(post.ID)}>Borrar</button>
                                )}
                            </div>
                        </div>
                        <p className="card-text mb-1">{post.MESSAGE}</p>

                        {post.IMAGE && (
                            <img className='img-fluid card-image-bottom' src={`data:image/MIME;base64,${post.IMAGE}`} alt='No se cargó bien la imagen'></img>
                        )}

                        <section className='mt-1'>
                            <button className={`btn btn-primary me-1 ${post.liked ? 'active' : ''}`} onClick={() => handleReaction(post.ID, true)}>
                                {post.likes > 0 ? <small className='me-2'>{post.likes}</small> : ''}
                                {post.liked ? 'Te gusta' : 'Dar me gusta'}
                            </button>
                            <button className={`btn btn-danger ${post.disliked ? 'active' : ''}`} onClick={() => handleReaction(post.ID, false)}>
                                {post.dislikes > 0 ? <small className='me-2'>{post.dislikes}</small> : ''}
                                {post.disliked ? 'No te gusta' : 'Dar no me gusta'}
                            </button>
                        </section>
                    </div>
                </div>
            ))}

            <nav>
                <ul className="pagination justify-content-center">
                    <li key={'prev'} className="page-item">
                        <span onClick={() => goToPage(Math.max(currentPage - 1, 1))} className="page-link">&laquo;</span>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                            <span onClick={() => goToPage(i)} className="page-link">{i}</span>
                        </li>
                    ))}
                    <li key={'next'} className="page-item">
                        <span onClick={() => goToPage(Math.min(currentPage + 1, totalPages))} className="page-link">&raquo;</span>
                    </li>
                </ul>
            </nav>
        </>
    )
}
