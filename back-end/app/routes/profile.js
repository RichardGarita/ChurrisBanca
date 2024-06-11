const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile');
const {checkToken} = require('../jsonWT');

router.get('/', checkToken, controller.getProfile);
router.put('/', checkToken, controller.editProfile);
router.get('/id', checkToken, controller.getUserId);
router.post('/',checkToken, controller.isFriend);

module.exports = router;