const express = require('express');

const router = express.Router();

//ROUTE api/auth
router.get('/', (req, res) => res.send('AUTH PAGE MAN!'));

module.exports = router;