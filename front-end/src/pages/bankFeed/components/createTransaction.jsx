import { useState } from "react";

function CreateTransaction ({userId}) {
    const [formData, setFormData] = useState({
        userId: userId,
        sender: '',
        amount: '',
        currency: 'churrumines',
      });


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
      };

    return (
        <>
            <form onSubmit={handleSubmit} className="text-start">
                <label htmlFor="sender">Receptor: </label>
                <input name="sender" id="sender" type="text" className="form-control" value={formData.sender} onChange={handleChange}/>

                <label>Monto</label>
                <input name="amount" id="amount" type="number" className="form-control" value={formData.amount} onChange={handleChange}/>

                <label>Moneda:</label>
                <select name="currency" id="currency" className="form-control" value={formData.currency} onChange={handleChange}>
                    <option value={'churrumines'}>Churrumines</option>
                    <option value={'euros'}>Euros</option>
                </select>

                <p className="mt-2 mb-2">TO-DO: Firmar transacción</p>

                <div className="text-end">
                    <button type="submit" className="btn btn-primary">Enviar</button>
                </div>
            </form>
        </>
    )
}

export default CreateTransaction;