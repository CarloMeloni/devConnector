const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

const router = express.Router();

//ROUTE api/auth
router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

//ROUTE  POST api/auth
//AUTHENTICATE USER AND GET TOKEN
//PUBLIC

router.post('/', [
    check('email', 'Your email is required!').isEmail(),
    check('password', 'A password is required!').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    try {
        // SEE IF USER EXISTS
        let user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials! man" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials! man" }] });
        }

        // RETURN JSONWEBTOKEN
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, config.get('jwtSecret'), 
            { expiresIn: 360000}, 
            (err, token) => {
                if(err) throw err;
                res.json({ token }) 
        });

    } catch(err)  {
        console.log(err.message);
        res.status(500).send('Server error man!!');
    }

    

});

module.exports = router;




















