const express = require('express');
const router = express.Router();
const posts = require('./posts');
const login = require('./login');
const bank = require('./bank');
const profile = require('./profile');

router.use('/posts', posts);
router.use('/login', login);
router.use('/profile', profile);
router.use('/bank', bank);

module.exports = router;