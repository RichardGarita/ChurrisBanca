const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');
const certs = require('../models/certs');
const { exec } = require('child_process');
const openssl = require('openssl-nodejs');

// Construir la ruta absoluta al certificado ca-cert.pem
const caPath = path.resolve(__dirname, '..', '..', 'certs', 'rootCACert.crt');

// Descomentar esto en la NAC

// const certPath = path.resolve(__dirname, '..', '..', 'certs', 'nodeAPI.crt');
// const keyPath = path.resolve(__dirname, '..', '..', 'certs', 'nodeAPI.key');
// const cert = fs.readFileSync(certPath);
// const key = fs.readFileSync(keyPath);

// Leer el certificado de la CA autofirmada
const ca = fs.readFileSync(caPath);

// Descomentar en la NAC
const agent = new https.Agent({  
  ca: ca,
  //cert: cert,
  //key: key
});

const CGI_API = 'https://cgibin05.com/cgi-bin/';
const GET_ACCOUNT_API = `${CGI_API}getAccount`;
const GET_TRANSACTIONS_API = `${CGI_API}getTransactions`;
const CREATE_TRANSACTIONS_API = `${CGI_API}makeTransaction`;

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
        else if(response.data.status === '204')
            return [];
        else
            throw new Error('Error interno del CGI');
    } catch (error){
        throw error;
    }
}

async function createTransaction(sender, receiver, amount, currency, privateKey) {
    try {
        const cert = await certs.getCertPath(sender);
        if(!cert) {
            throw new Error('Certificado Inválido');
        }
        const certPath = path.resolve(__dirname, '..', '..', 'users', cert);
        
        const isValid = await validateCert(certPath);

        // Si el certificado no es válido, lanzar un error
        if (!isValid) {
            throw new Error('Certificado Inválido');
        }

        const isValidKey = await validatePrivateKeyWithCertificate(privateKey, certPath);

        if (!isValidKey) {
            throw new Error('La clave privada no corresponde al certificado');
        }

        const transaction = `ID1=${sender}&AMOUNT=${amount}&ID2=${receiver}&CURRENCY=${currency}`;
        const sign = await signtext(transaction, privateKey);

        if (!sign) {
            throw new Error('Error al firmar');
        }
        const request = `${transaction}&SIGN=${sign}`;
        const response = await axios.post(CREATE_TRANSACTIONS_API, request, { httpsAgent: agent });
        if (response.data.status === '200')
            return response.data;
        else if(response.data.status === '404'){
            throw new Error('No se encontró la cuenta del receptor');
        } else if(response.data.status === '402'){
            throw new Error('Saldo Insuficiente');
        } else {
            throw new Error('Error interno del CGI');
        }
    } catch (error){
        throw error;
    }
}

function validateCert(clientCertPath) {
    return new Promise((resolve, reject) => {
        const command = [
            'verify',
            '-CAfile', caPath,
            clientCertPath
        ];

        openssl(command, (err, buffer) => {
            if (err.toString()) {
                if (err.toString().includes('verification failed')) {
                    resolve(false);
                } else {
                    reject(err);
                }
                return;
            }

            const stdout = buffer.toString();

            if (stdout.includes('OK')) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

function validatePrivateKeyWithCertificate(privateKey, certificatePath) {
    return new Promise((resolve, reject) => {
        const commandCert = `openssl x509 -noout -modulus -in "${certificatePath}"`;
        const commandKey = ['rsa', '-noout', '-modulus', '-in', {name: "key.key", buffer: Buffer.from(privateKey, 'utf-8')}];

        exec(commandCert,(errCert, stdoutCert, stderrCert) => {
            if (errCert) {
                console.error(`Error al ejecutar comando de certificado: ${errCert}`);
                reject(errCert);
                return;
            }
            if (stderrCert) {
                console.error(`Error en stderr del comando de certificado: ${stderrCert}`);
                reject(stderrCert);
                return;
            }
            const modulusCert = stdoutCert.trim();

            openssl(commandKey, (errKey, buffer) => {
                if (errKey.toString()) {
                    console.error(`Error al ejecutar comando de clave privada: ${errKey.toString()}`);
                    reject(errKey);
                    return;
                }
                const modulusKey = buffer.toString().replace(/,/g, '').trim();
                // Comparar los módulos del certificado y de la clave privada
                resolve(modulusCert === modulusKey);
            });
        });
    });
}

function signtext(text, privateKey){
    return new Promise((resolve, reject) => {
        const opensslDir = path.join(__dirname, '..', '..', 'openssl');
        const privateKeyFile = path.join(opensslDir, 'key.key');
        const textFile = path.join(opensslDir, 'text.txt');

        const command = [
            'pkeyutl',
            '-sign',
            '-inkey',
            {name: "key.key", buffer: Buffer.from(privateKey, 'utf-8')},
            '-in',
            {name: "text.txt", buffer: Buffer.from(text, 'utf-8')}
        ];

        openssl(command, (err, buffer) => {
            if (err.toString()) {
                reject(err);
                return;
            }

            fs.unlink(privateKeyFile, (unlinkKeyErr) => {
                if (unlinkKeyErr) console.error(`Failed to delete private key file: ${unlinkKeyErr.message}`);
            });
            fs.unlink(textFile, (unlinkTextErr) => {
                if (unlinkTextErr) console.error(`Failed to delete text file: ${unlinkTextErr.message}`);
            });

            const result = buffer[0].toString('hex');
            resolve(result);
        });
    });
}

module.exports = {
    getAccount,
    getTransactions,
    createTransaction,
}