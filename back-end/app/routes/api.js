const express = require('express');
const router = express.Router();
const posts = require('./posts');
const login = require('./login');
const profile = require('./profile');

router.use('/posts', posts);
router.use('/login', login);
router.use('/profile', profile);

module.exports = router;