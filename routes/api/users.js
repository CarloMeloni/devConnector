const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

//ROUTE  POST api/user
//REGISTER USER
router.post('/', [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Your email is required!').isEmail().not().isEmpty(),
    check('password', 'A password is required!').isLength({min: 6, max: 20}).not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try {
        // SEE IF USER EXISTS
        let user = await User.findOne({ email: email});

        if(user) {
            return res.status(400).json({ errors: [{ msg: "User already exists!" }] })
        }

        //GET USER AVATAR
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar, 
            password
        });

        // ENCRYPT PASSWORD
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // RETURN JSONWEBTOKEN


        res.send('USER REGISTERED MAN!');
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error man!!');
    }

    

});

module.exports = router;