import { useState } from "react";
import axios from "axios";
import AuthToken from '../../../config/config';

const URL_API = 'http://localhost:4223/api/bank/createTransaction'

function CreateTransaction () {
    const token = localStorage.getItem('token');
    if (!token)
        window.location.replace('/');

    const [formData, setFormData] = useState({
        receiver: '',
        amount: '',
        currency: 'Ch',
        privateKey: '',
    });

    const [errorMessage, setErrorMessage] = useState({
        receiver: '',
        amount: '',
        privateKey: '',
    });

    const receiverRegex = /^\d{9}$/;
    const amountRegex = /^\d{1,50}(\.\d{2})$/;
    const privateKeyRegex = /^-----BEGIN PRIVATE KEY-----[\r\n]+([A-Za-z0-9+/=\r\n]+)[\r\n]+-----END PRIVATE KEY-----$/;

    const handleSubmit = (e) => {
        e.preventDefault();

        let valid = true;
        let errors = {
            receiver: '',
            amount: '',
            privateKey: '',
        };

        if (!receiverRegex.test(formData.receiver)) {
            errors.receiver = 'El receptor debe ser un número de 9 dígitos';
            valid = false;
        }

        if (parseFloat(formData.amount) <= 0) {
            errors.amount = 'El monto debe ser mayor a 0';
            valid = false;
        }

        if (!amountRegex.test(formData.amount)) {
            errors.amount = 'El monto debe tener al menos 1 dígito y 2 decimales';
            valid = false;
        }

        if (!formData.privateKey) {
            errors.privateKey = 'Debe seleccionar una llave privada';
            valid = false;
        } else if (!privateKeyRegex.test(formData.privateKey)) {
            errors.privateKey = 'El contenido de la llave privada no es válido';
            valid = false;
        }

        if(formData.receiver === formData.sender) {
            errors.receiver = 'El receptor debe ser distinto al emisor';
            valid = false;
        }

        setErrorMessage(errors);

        if(!valid)
            return;

        AuthToken(token);
        axios.post(URL_API, formData).then(() => {
            alert('Transacción completada exitosamente');
            window.location.reload();
        }).catch((error) => {
            if(error.response && error.response.status === 501)
                alert('El certificado no es válido. Seguridad comprometida');
            else if(error.response && error.response.status === 401)
                alert('Llave privada inválida');
            else if(error.response && error.response.status === 404)
                alert('No se encontró al receptor');
            else if(error.response && error.response.status === 402)
                alert('Saldo insuficiente');
            else
                alert('Error interno. Intente más tarde.');
        })
        setFormData({
            receiver: '',
            amount: '',
            currency: 'Ch',
            privateKey: '',
        })
    }

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'privateKey') {
            const file = files[0];
            if (file) {
                if (file.name.endsWith('.key')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const text = e.target.result;
                        setFormData((prevState) => ({ ...prevState, privateKey: text}));
                    };
                    reader.readAsText(file);
                } else {
                    setErrorMessage((prevState) => ({ ...prevState, privateKey: 'El archivo debe ser de tipo .key' }));
                    alert('El archivo debe ser de tipo .key');
                }
            }
        } else {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }
        setErrorMessage((prevState) => ({ ...prevState, [name]: '' }));
      };

    return (
        <>
            <form onSubmit={handleSubmit} className="text-start">
                <div className=" form-group mb-1">
                    <label htmlFor="receiver">Receptor: </label>
                    <input name="receiver" id="receiver" type="number" className="form-control" value={formData.receiver} onChange={handleChange}/>
                </div>
                {errorMessage.receiver && <small className="text-danger">{errorMessage.receiver}</small>}

                <div className=" form-group mb-1">
                    <label htmlFor="amount">Monto</label>
                    <input name="amount" id="amount" type="number" className="form-control" value={formData.amount} onChange={handleChange}
                    min={0.01} step={0.01}/>
                    {errorMessage.amount && <small className="text-danger mb-1">{errorMessage.amount}</small>}
                </div>

                <div className=" form-group mb-1">
                    <label htmlFor="currency">Moneda:</label>
                    <select name="currency" id="currency" className="form-control" value={formData.currency} onChange={handleChange}>
                        <option value={'Ch'}>Churrumines</option>
                        <option value={'Eu'}>Euros</option>
                    </select>
                </div>

                <div className=" form-group mb-1">
                    <label htmlFor="amount">Llave privada:</label>
                    <input name="privateKey" id="privateKey" type="file" className="form-control" onChange={handleChange} accept=".key"/>
                    {errorMessage.privateKey && <small className="text-danger mb-1">{errorMessage.privateKey}</small>}
                </div>

                <div className="text-end">
                    <button type="submit" className="btn btn-primary">Enviar</button>
                </div>
            </form>
        </>
    )
}

export default CreateTransaction;