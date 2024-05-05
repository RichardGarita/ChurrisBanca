const express = require('express');
const router = express.Router();
const controller = require('../controllers/posts');

router.get('/', controller.getSocialFeedPosts);

router.post('/likes', controller.addLike);
router.post('/dislikes', controller.addDislike);

router.delete('/:postId', controller.deletePost);

module.exports = router;