const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//ROUTE api/profile/me
//GET CURRENT USERS PROFILE
//PRIVATE
router.get('/me', auth,  async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user!' })
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Error server man!');
    }
});

module.exports = router;