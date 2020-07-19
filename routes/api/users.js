const express = require('express');

const router = express.Router();

//ROUTE api/user
router.get('/', (req, res) => res.send('USER PAGE MAN!'));

module.exports = router;