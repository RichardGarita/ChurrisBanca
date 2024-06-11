const express = require('express');
const router = express.Router();
const controller = require('../controllers/bank');
const {checkToken} = require('../jsonWT');

router.get('/', checkToken, controller.getAccount);
router.get('/transactions', checkToken, controller.getTransactions);
router.post('/createTransaction', checkToken, controller.createTransaction);

module.exports = router;