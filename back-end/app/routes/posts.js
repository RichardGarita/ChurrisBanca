const express = require('express');
const router = express.Router();
const controller = require('../controllers/posts');
const {checkToken} = require('../jsonWT');

router.get('/', checkToken, controller.getSocialFeedPosts);

router.post('/', checkToken, controller.createPost);
router.post('/likes', checkToken, controller.addLike);

router.delete('/:postId', checkToken, controller.deletePost);

module.exports = router;