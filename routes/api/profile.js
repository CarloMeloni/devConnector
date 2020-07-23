const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//ROUTE  GET api/profile/me
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



//ROUTE  POST api/profile
//CREATE OR UPDATE A USER PROFILE
//PRIVATE
router.post('/', [auth, [
    check('status', 'Status is required!').not().isEmpty(),
    check('skills', 'Skills is required!').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //BUILD PROFILE OBJECT
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //BUILD SOCIAL OBJECT
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            //UPDATE
            profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields }, 
                    { new: true }
                );

            return res.json(profile);
        }
    
        //CREATE
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);

    }catch(err) {
        console.error(err.message);
        res.status(500).send({ msg: 'Server error!' });
    }
});






//ROUTE  GET api/profile
//GET ALL PROFILE
//PUBLIC
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error man!');
    }
});





//ROUTE  GET api/profile/user/:user_id
//GET A PROFILE BY ID
//PUBLIC
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({ msg: 'Profile not found!' });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found!' });
        }
        res.status(500).send('Server error man!');
    }
})





//ROUTE  DELETE api/profile/user/:user_id
//DELETE PROFILE, USER AND POSTS
//PRIVATE
router.delete('/', auth, async (req, res) => {
    try {
        //REMOVE USER POSTS

        //REMOVE PROFILE
        await Profile.findOneAndRemove({ user: req.user.id });

        //REMOVE USER
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error man!');
    }
});






//ROUTE  PUT api/profile/experience
//ADD PROFILE EXPERIENCE
//PRIVATE
router.put(
    '/experience',
    [
      auth,
      [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
         // .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );






  //ROUTE  DELETE api/profile/experience/:exp_id
//DELETE EXPERIENCE FROM PROFILE
//PRIVATE
router.delete('/experiece/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.essage);
        res.status(500).send('Server error!')
    }
});


module.exports = router;