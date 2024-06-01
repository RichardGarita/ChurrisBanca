import { useState } from "react";
import axios from "axios";

const URL_API = 'http://localhost:4223/api/bank/createTransaction'

function CreateTransaction ({userId}) {
    const [formData, setFormData] = useState({
        sender: userId,
        receiver: '',
        amount: '',
        currency: 'Ch',
    });

    const [errorMessage, setErrorMessage] = useState({
        receiver: '',
        amount: '',
    });

    const receiverRegex = /^\d{1,10}$/;
    const amountRegex = /^\d{1,50}(\.\d{2})$/;

    const handleSubmit = (e) => {
        e.preventDefault();

        let valid = true;
        let errors = {
            receiver: '',
            amount: '',
        };

        if (!receiverRegex.test(formData.receiver)) {
            errors.receiver = 'El receptor debe ser un número de 10 dígitos';
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

        setErrorMessage(errors);

        if(!valid)
            return;

        axios.post(URL_API, formData).then((response) => {
            if (Number(response.data.status) === 200) {
                alert('Transacción completada exitosamente');
                window.location.reload();
            }
            else {
                alert('Error inesperado. Intente de nuevo');
                console.log(response.data);
            }
        }).catch((error) => {
            console.error(error);
            alert('Error interno. Intente más tarde.')
        })
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
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
                    min={1.00}/>
                    {errorMessage.amount && <small className="text-danger mb-1">{errorMessage.amount}</small>}
                </div>

                <div className=" form-group mb-1">
                    <label htmlFor="currency">Moneda:</label>
                    <select name="currency" id="currency" className="form-control" value={formData.currency} onChange={handleChange}>
                        <option value={'Ch'}>Churrumines</option>
                        <option value={'Eu'}>Euros</option>
                    </select>
                </div>

                <p className="mt-2 mb-2">TO-DO: Firmar transacción</p>

                <div className="text-end">
                    <button type="submit" className="btn btn-primary">Enviar</button>
                </div>
            </form>
        </>
    )
}

export default CreateTransaction;