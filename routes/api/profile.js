const express = require('express');

const router = express.Router();

//ROUTE api/profile
router.get('/', (req, res) => res.send('PROFILE PAGE MAN!'));

module.exports = router;