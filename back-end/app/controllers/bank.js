const Service = require('../services/bank');

async function getAccount(req, res){
    try {
        const {userId} = req.body;
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
        const {userId} = req.body;
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
        const {sender, receiver, amount, currency} = req.body;
        if (!sender || !receiver || !amount || !currency) {
            res.status(400).json('All fields are required');
            return
        }
        const result = await Service.createTransaction(sender, receiver, amount, currency);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getAccount,
    getTransactions,
    createTransaction,
}