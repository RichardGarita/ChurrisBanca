const Service = require('../services/bank');

async function getAccount(req, res){
    try {
        const userId = req.user.ID;
        if (!userId) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await Service.getAccount(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getTransactions(req, res){
    try {
        const userId = req.user.ID;
        if (!userId) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await Service.getTransactions(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function createTransaction(req, res) {
    try {
        const {receiver, amount, currency, privateKey} = req.body;
        const userId = req.user.ID;
        if (!userId || !receiver || !amount || !currency || !privateKey) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await Service.createTransaction(userId, receiver, amount, currency, privateKey);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error: ${error}`);
        if (error.message === 'Certificado Inválido') {
            res.status(501).json(error);
        } else if(error.message === 'La clave privada no corresponde al certificado'){
            res.status(401).json(error);
        }else if(error.message === 'No se encontró la cuenta del receptor'){
            res.status(404).json(error);
        } else if(error.message === 'Saldo Insuficiente'){
            res.status(402).json(error);
        } else {
            res.status(500).json(error);
        }
    }
}

module.exports = {
    getAccount,
    getTransactions,
    createTransaction,
}