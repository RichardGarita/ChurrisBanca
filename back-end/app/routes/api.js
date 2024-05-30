const express = require('express');
const router = express.Router();
const posts = require('./posts');
const login = require('./login');

router.use('/posts', posts);
router.use('/login', login);

module.exports = router;