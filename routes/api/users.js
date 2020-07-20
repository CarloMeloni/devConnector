const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

//ROUTE  POST api/user
//REGISTER USER
router.post('/', [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Your email is required!').isEmail().not().isEmpty(),
    check('password', 'A password is required!').isLength({min: 6, max: 20}).not().isEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('USER PAGE MAN!');

});

module.exports = router;