const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile');

router.get('/', controller.getProfile);
router.put('/', controller.editProfile)

module.exports = router;