const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile');

router.get('/', controller.getProfile);
router.put('/', controller.editProfile);
router.get('/id', controller.getUserId);

module.exports = router;