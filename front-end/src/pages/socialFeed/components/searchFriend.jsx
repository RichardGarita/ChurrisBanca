import { useState, useEffect } from "react";
import axios from "axios";
import AuthToken from '../../../config/config';

const URL_API = 'http://localhost:4223/api/users/friends';

export default function SearchFriend(){
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState('');

    const token = localStorage.getItem('token');
    if (!token)
        window.location.replace('/');

    useEffect(() => {
        AuthToken(token);
        axios.get(URL_API).then((response) => {
            setFriends(response.data);
            console.log(response.data);
        }).catch((error) => {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                alert('Sesión Expirada');
                window.location.replace('/');
            } else {
                alert('Error al obtener la lista de amigos');
            }
        })
    }, [token])

    return <>
        {friends.length > 0 ? (
            <>
                <select className="form-control" onChange={(e) => setSelectedFriend(e.target.value)}>
                    <option value="">Seleccione un amigo</option>
                    {friends.map((friend, index) => <option key={index} value={friend.friend_id}>{friend.friend_username}</option>)}
                </select>

                <button disabled={!selectedFriend} className="btn btn-primary mt-2" onClick={() => window.location.replace(`/others-profile/${selectedFriend}`)}>Ver perfil de amigo</button>
            </>
        ): (
            <>
                <p>No tienes amigos :(</p>
            </>
        )}
    </>
}