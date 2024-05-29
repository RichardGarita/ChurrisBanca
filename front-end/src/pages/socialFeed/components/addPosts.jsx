import { useState } from "react";
import axios from "axios";

const URL_API = 'http://localhost:4223/api/posts';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10mb

const userId = 3;

export default function AddPost() {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const sendRequest = (data) => {
        axios.post(URL_API, data).then(() => {
            alert('Publicación creada exitosamente');
            window.location.reload();
        }).catch((error) => {
            console.error(error);
            alert('Error al crear la publicación');
        })

    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (image) {
            if (!image.type.startsWith('image/')) {
                setErrorMessage('Por favor, selecciona un archivo de imagen.');
                return;
            }

            if (image.size > MAX_FILE_SIZE_BYTES) {
                setErrorMessage(`El tamaño máximo del archivo permitido es de ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`);
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(image);
            
            reader.onload = async () => {
                const base64String = reader.result.split(',')[1];
                const data = {
                    userId,
                    message,
                    picture: base64String
                };
                sendRequest(data);
            }
        } else {
            const data = {
                userId,
                message
            }
            sendRequest(data);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group text-start col-11 mx-auto">
                    <label htmlFor="content">Contenido</label>
                    <textarea id="content" name="content" className='form-control' 
                    type="text" onChange={(event) => setMessage(event.target.value)}
                    maxLength={200} placeholder="Longitud máxima de 500 caractéres"/>
                </div>

                <div className="form-group text-start col-11 mx-auto">
                    <label htmlFor="image">Imagen</label>
                    <input id="image" name="image" className='form-control' type="file"
                    accept="image/*" onChange={(event) => {
                        setImage(event.target.files[0])
                        setErrorMessage('');
                        }}/>
                    {errorMessage && <small>{errorMessage}</small>}
                </div>

                <div className="mt-2 col-11 mx-auto text-end">
                    <button type="submit" className="btn btn-primary">Agregar</button>
                </div>
            </form>
        </>
    )
}