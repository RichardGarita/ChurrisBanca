import { useState, useEffect } from "react";
import { PlusCircleOutlined } from '@ant-design/icons';
import {Button} from 'antd';
import axios from "axios";
import CreateTransaction from "./components/createTransaction";
import Modal from "../../utils/Modal";
import '../../styles/BankFeed.css';
import data from "./dummyData";

const userId = 402560399;
const URL_API = 'https://cgibin05.com:8000/cgi-bin/getAccount';

function BankFeed(){
    const [balance, setBalance] = useState({});

    const [transactions, setTransactions] = useState([]);
    const [currentTransactions, setCurrentTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const transactionsPerPage = 1;

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        /** TO-DO:  Llamada al CGI*/
        setTransactions(data.transactions);
    }, [])

    useEffect(() => {
        const body = `ID=${userId}`;
        axios.post(URL_API, body).then((response) => {
            if (Number(response.data.status) === 200)
                setBalance(response.data.account);
            else if (Number(response.data.status) === 404)
                alert('No se encontró la cuenta');
            else
            alert('Error inesperado. Intente de nuevo');
        }).catch((error) => {
            console.error(error);
            alert('Error del servidor. Intente de nuevo');
        })
    }, [])

    useEffect(() => {
        let startIndex = (currentPage - 1) * transactionsPerPage;
        let endIndex = startIndex + transactionsPerPage;
        setCurrentTransactions(transactions.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(transactions.length/transactionsPerPage));
    }, [currentPage, transactions]);

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    return (
        <>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                title={'Crear transacción'}
                content={<CreateTransaction userId={userId}/>}
            />
            <section className='col-7 row mx-auto my-2'>
                <div className="col-6 text-start d-flex align-items-center p-0">
                    <h4><strong>Balance: </strong>{balance.AMOUNT} {balance.CURRENCY}</h4>
                </div>
                <div className="col-6 text-end p-0">
                <Button onClick={() => setShowModal(true)} className='w-auto h-auto'
                icon={<><PlusCircleOutlined className='fs-1'/>
                    <p className="d-inline m-auto ms-1">Nueva transacción</p></>}
                />
                </div>
            </section>
            {currentTransactions.map((transaction, index) => 
                <div key={index} className='card col-7 mx-auto text-start mb-1'>
                    <div className='card-body'>
                        <div className='row'>
                            <small className="card-subtitle text-body-secondary text-center mb-1">{transaction.TIMESTAMP}</small>
                            <div className='col-4'>
                                <small className="card-subtitle text-body-secondary">Remitente:</small>
                                <div>
                                    <h5 className='card-title mb-1 d-inline'>{transaction.sender}</h5>
                                </div>
                            </div>
                            <div className='col-4 text-center'>
                                <small className="card-subtitle text-body-secondary">Monto:</small>
                                <div>
                                    <h5 className='card-title mb-1 d-inline'>{transaction.amount}</h5>
                                </div>
                            </div>
                            <div className='col-4 text-end'>
                                <small className="card-subtitle text-body-secondary">Receptor:</small>
                                <div>
                                    <h5 className='card-title mb-1 d-inline'>{transaction.receiver}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

export default BankFeed;