const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const {checkToken} = require('../jsonWT');

router.get('/friends', checkToken, controller.getFriends);

router.get('/follows', checkToken, controller.getFollowed);
router.delete('/follows', checkToken, controller.unfollowUser);

router.post('/follow', checkToken, controller.followUser);

module.exports = router;