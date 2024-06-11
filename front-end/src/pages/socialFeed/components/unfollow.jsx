import { useState, useEffect } from "react";
import axios from "axios";
import AuthToken from '../../../config/config';

const URL_API = 'http://localhost:4223/api/users/follows';

export default function Unfollow(){
    const [following, setFollowing] = useState([]);
    const [selectedFollowed, setSelectedFollowed] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const token = localStorage.getItem('token');
    if (!token)
        window.location.replace('/');

    useEffect(() => {
        AuthToken(token);
        axios.get(URL_API).then((response) => {
            setFollowing(response.data);
        }).catch((error) => {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                alert('Sesión Expirada');
                window.location.replace('/');
            } else {
                alert('Error al obtener la lista de seguidos');
            }
        })
    }, [token])

    const handleUnfollow = (event) => {
        event.preventDefault();

        if (!selectedFollowed) {
            setErrorMessage('Debe seleccionar un nombre');
            return;
        }

        AuthToken(token);
        axios.delete(URL_API, {
            data: { toUnfollow: selectedFollowed }
        }).then(() => {
            alert('Usuario dejado de seguir')
        }).catch((error) => {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                alert('Sesión Expirada');
                window.location.replace('/');
            } else if (error.response && error.response.status === 404){
                alert('No se encontró al usuario');
            } else if (error.response && error.response.status === 402){
                alert('No eres seguidor de este usuario');
            } else {
                console.log(error);
                alert('Error al dejar de seguir al usuario');
            }
        })
    }

    return <>
        {following.length > 0 ? (
            <>
                <select className="form-control" onChange={(e) => {
                        setErrorMessage('');
                        setSelectedFollowed(e.target.value);
                    }}>
                    <option value="">Seleccione a una de las personas que sigue</option>
                    {following.map((followed, index) => <option key={index} value={followed.id}>{followed.username}</option>)}
                </select>
                {errorMessage && <small className="text-danger">{errorMessage}</small>}

                <button disabled={!selectedFollowed} className="btn btn-primary mt-2" onClick={(event) => handleUnfollow(event)}>Dejar de seguir</button>
            </>
        ): (
            <>
                <p>Aún no sigues a nadie</p>
            </>
        )}
    </>
}