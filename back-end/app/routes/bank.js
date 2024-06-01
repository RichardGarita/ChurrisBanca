const express = require('express');
const router = express.Router();
const controller = require('../controllers/bank');

router.post('/', controller.getAccount);
router.post('/transactions', controller.getTransactions);

module.exports = router;