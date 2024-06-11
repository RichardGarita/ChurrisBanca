import { useState } from "react";
import axios from "axios";
import AuthToken from '../../../config/config';

const URL_API = 'http://localhost:4223/api/users/follow';

export default function Follow(){
    const [toFollow, setToFollow] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const token = localStorage.getItem('token');
    if (!token)
        window.location.replace('/');

    const handleSubmit = ((event) => {
        event.preventDefault();

        if (!toFollow) {
            setErrorMessage('Debe ingresar un nombre');
            return;
        }

        const regex = /^[a-zA-Z._]+$/;
        if (!regex.test(toFollow)) {
            setErrorMessage('El nombre sólo puede contener letras, puntos y guiones bajos');
            return;
        }

        AuthToken(token);
        axios.post(URL_API, {toFollow: toFollow}).then(() => {
            alert('Usuario Seguido')
        }).catch((error) => {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                alert('Sesión Expirada');
                window.location.replace('/');
            } else if (error.response && error.response.status === 404){
                alert('No se encontró al usuario');
            } else if (error.response && error.response.status === 402){
                alert('Ya eres seguidor de este usuario');
            } else {
                console.log(error);
                alert('Error al seguir al usuario');
            }
        })
    })

    return <>
        <form onSubmit={handleSubmit}>
            <div className="form-group text-start col-11 mx-auto">
                <label htmlFor="toFollow">Nombre del usuario a seguir</label>
                <input id="toFollow" name="toFollow" className='form-control' 
                type="text" onChange={(event) => {
                    setErrorMessage('');
                    setToFollow(event.target.value)}}
                placeholder="nombre.apellido"/>
                {errorMessage && <small className="text-danger">{errorMessage}</small>}
            </div>

            <button type="submit" disabled={!toFollow} className="btn btn-primary mt-2" >Seguir al usuario</button>
        </form>
    </>
}