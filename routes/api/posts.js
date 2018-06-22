const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts
// @desc    get all posts
// @access  Public
router.get('/', (req, res) => {
  Post.find().sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(e => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    get post by id
// @access  Public
router.get('/:post_id', (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => res.json(post))
    .catch(e => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if(!isValid) {
    // if any errors, send 400 with errors obj
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id  
  });

  newPost.save().then(post => res.json(post))
    .catch(e => res.status(404).json(errors));
});

// @route   DELETE api/posts/:id
// @desc    delete post by id
// @access  Private
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      // check for post owner, post.user is a object id => parse it to string
      if(post.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: 'User not authorized' });
      }
      // delete
      post.remove().then(() => res.json({ success: true })); 
    })
    .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/like/:id
// @desc    like post
// @access  Private
router.post('/like/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(404).json({ alreadyliked: 'User already liked this post' });
      }

      // Add user id to likes array
      post.likes.unshift({ user: req.user.id });

      post.save().then(post => res.json(post));
    })
    .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({ notliked: 'You have not yet liked this post' });
      }

      // get remove index
      const removeIndex = post.likes
        .map(item => item.user.toString())
        .indexOf(req.user.id);

      // splice out of array
      post.likes.splice(removeIndex, 1);
      // save 
      post.save().then(post => res.json(post));
    })
    .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  // check validation
  if(!isValid) {
    // if any errors, send 400 with errors obj
    return res.status(400).json(errors);
  }
  
  Post.findById(req.params.post_id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };

      // add comment to array
      post.comments.unshift(newComment);

      // save
      post.save().then(post => res.json(post));
    })
    .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    delete comment from a post
// @access  Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      // get the comment by id
      const removeComment = post.comments.filter(comment => comment.id.toString() === req.params.comment_id)[0];
      // check to see if comment exists
      if(!removeComment) {
        return res.status(404).json({ commentnotexists: 'Comment does not exists' });
      }
      // if logged-in user not own this post or this comment
      if(req.user.id !== post.user.toString() && req.user.id !== removeComment.user.toString()) {
        return res.status(401).json({ notauthorized: 'User not authorized' })
      } 
      // get remove index
      const removeIndex = post.comments
        .map(comment => comment.id)
        .indexOf(req.params.comment_id);
      
      // splice comment from array
      post.comments.splice(removeIndex, 1);

      post.save().then(post => res.json(post));
    })
    .catch(e => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;