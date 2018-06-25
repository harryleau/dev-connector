const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => {
  res.json({msg: "profile works!"});
});

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if(!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(e => res.status(404).json({profile: 'There are no profiles'}));
})

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json({profile: 'There is no profile for this user'}));
});


// @route   POST api/profile
// @desc    Create user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // check validation
  if(!isValid) {
    // return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get fields
  const profileFields = {};

  profileFields.user = req.user.id;

  profileFields.handle = req.body.handle;
  
  profileFields.company = req.body.company;

  profileFields.website = req.body.website;
    
  profileFields.location = req.body.location;
    
  profileFields.bio = req.body.bio;
    
  profileFields.status = req.body.status;
  
  profileFields.githubusername = req.body.githubusername;
  
  // skills - split into array
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  // social
  profileFields.social = {};

  profileFields.social.youtube = req.body.youtube;

  profileFields.social.twitter = req.body.twitter;
   
  profileFields.social.facebook = req.body.facebook;
    
  profileFields.social.linkedin = req.body.linkedin;
    
  profileFields.social.instagram = req.body.instagram;
  
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(profile) {
        ///// update
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
          .then(profile => res.json(profile));
      } else {
        ///// create
        
        // check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if(profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // Save profile
            new Profile(profileFields).save()
              .then(profile => res.json(profile))
          })
      }
    })
});

// @route   POST api/profile/experience
// @desc    Add exp to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // check validation
  if(!isValid) {
    // return any errors with 400 status
    return res.status(400).json(errors);
  }
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add to exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    })
    .catch(e => res.json(e));
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  // check validation
  if(!isValid) {
    // return any errors with 400 status
    return res.status(400).json(errors);
  }
  
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    })
    .catch(e => res.json(e));
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    delete on experience item from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
     // get remove index
     const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
     // check if id not found
     if(removeIndex < 0) {
       return res.status(404).json({ notfound: 'experience item not found' });
     }
     // splice education from array
     profile.experience.splice(removeIndex, 1);
     // save
     profile.save().then(profile => res.json(profile))
       .catch(e => res.status(404).json(e));
    })
    .catch(e => res.status(404).json(e));
});

// @route   DELETE api/profile/education/:edu_id
// @desc    delete one education item from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      // get remove index
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
      // check if id not found
      if(removeIndex < 0) {
        return res.status(404).json({ notfound: 'education item not found' });
      }
      // splice education from array
      profile.education.splice(removeIndex, 1);
      // save
      profile.save().then(profile => res.json(profile))
        .catch(e => res.status(404).json(e));
    })
    .catch(e => res.status(404).json(e));
});

// @route   DELETE api/profile
// @desc    delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }));
    })
    .catch(e => res.status(404).json(e));
});

module.exports = router;