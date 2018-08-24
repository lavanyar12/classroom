const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const passport = require('passport');

var User = require('../models/user');

// Student login page
router.get('/studentlogin', (req, res) => {
  res.render('users/studentlogin', {
    layout: 'main'
  })
})

router.get('/login', (req,res) => {
  res.render('users/login')
})

router.get('/register', (req,res) => {
  res.render('users/register')
})

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { //local strategy
    successRedirect:'/lessons',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Student Login Form POST
router.post('/studentlogin', (req, res, next) => {
  passport.authenticate('local', { //local strategy
    successRedirect:'/home',
    failureRedirect: '/home',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  //console.log(req.body)
  if(req.body.password != req.body.password2){
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })

   } else {
    User.findOne({username: req.body.username})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Username already registered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            accountType: 'STUDENT',
            username: req.body.username           
          });
          
          //now use becrypt to hash and save the password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
    }
});

//Logout user
router.get('/logout', (req,res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

//Logout student user
router.get('/studentlogout', (req,res) => {
  req.logout();
  req.flash('success_msg', 'Thank you for visiting ! You are now logged out')
  res.redirect('/home')
})

module.exports = router;