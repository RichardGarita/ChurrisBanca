const express = require('express');
const router = express.Router();
const posts = require('./posts');
const login = require('./login');
const bank = require('./bank');

router.use('/posts', posts);
router.use('/login', login);
router.use('/bank', bank);

module.exports = router;