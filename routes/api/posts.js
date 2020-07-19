const express = require('express');

const router = express.Router();

//ROUTE api/posts
router.get('/', (req, res) => res.send('POSTS PAGE MAN!'));

module.exports = router;