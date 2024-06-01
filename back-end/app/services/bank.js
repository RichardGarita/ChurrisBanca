const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Construir la ruta absoluta al certificado ca-cert.pem
const caPath = path.resolve(__dirname, '..', '..', 'certs', 'rootCACert.crt');
// Leer el certificado de la CA autofirmada
const ca = fs.readFileSync(caPath);

const agent = new https.Agent({  
  ca: ca
});

const CGI_API = 'https://cgibin05.com/cgi-bin/';
const GET_ACCOUNT_API = `${CGI_API}getAccount`;
const GET_TRANSACTIONS_API = `${CGI_API}getTransactions`;

async function getAccount(userId){
    try {
        const request = `ID=${userId}`;
        const response = await axios.post(GET_ACCOUNT_API, request, { httpsAgent: agent });
        if (response.data.status === '200')
            return response.data.account;
        else
            throw new Error('Error interno del CGI');
    } catch (error){
        throw error;
    }
}

async function getTransactions(userId){
    try {
        const request = `ID=${userId}`;
        const response = await axios.post(GET_TRANSACTIONS_API, request, { httpsAgent: agent });
        if (response.data.status === '200')
            return response.data.transactions;
        else
            throw new Error('Error interno del CGI');
    } catch (error){
        throw error;
    }
}

module.exports = {
    getAccount,
    getTransactions,
}