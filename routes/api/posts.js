const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { text } = require('express');

//ROUTE api/posts
//CREATE A POST
//PRIVATE
router.post('/', [auth, [
    check('text', 'Text is required man!').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await (await User.findById(req.user.id)).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.send(500).send('Server error!')
    }

});








//ROUTE api/posts
//GET ALL POSTS
//PRIVATE
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.send(500).send('Server error!')
    }
})








//ROUTE api/posts/:id
//GET POST BY ID
//PRIVATE
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found!' })
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);

        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found!' })
        }

        res.send(500).send('Server error!')
    }
})








//ROUTE DELETE api/posts/:id
//REMOVE A POST
//PRIVATE
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found!' })
        }

        //CHECK USER
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized!' });
        }

        await post.remove();

        res.json({ msg: 'Post is removed!' });
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found!' })
        }
        res.send(500).send('Server error!')
    }
})




module.exports = router;