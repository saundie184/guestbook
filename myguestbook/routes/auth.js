var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');

//set up knex
var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'guestbook',
    username: 'SaundieWeiss'
  }
});

//GET sign-up form
router.get('/signup', function(req, res) {
  res.render('signup', {
    title: 'My Guestbook',
    welcome: ''
  });
});

//POST signup info
router.post('/signup', function(req, res) {
  console.log(req.body);
  //TODO add more validation for fields
  if (req.body.password === req.body.passwordconfirm) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.
        knex('guests').insert({
          username: req.body.username,
          first_name: req.body.firstname,
          last_name: req.body.lastname,
          email: req.body.email,
          password: hash
        }).then(
          res.render('guestbook', {
            title: 'My Guestbook',
            welcome: 'Welcome, ' + req.body.username,
            data: req.body
          })
        );
      });
    });
  } else {
    res.redirect('/signup');
  }
});



//GET for signin
router.get('/signin', function(req, res, next) {
  res.render('signin', {
    title: 'My Guestbook',
    welcome: ''
  });
});

//POST for signin authenticaiton
router.post('/signin', function(req, res, next) {
  // console.log(req.body.username);
  //check user name in db
  knex('guests').first().where({
    username: req.body.username
  }).then(function(user) {
    bcrypt.compare(req.body.password, user.password, function(err, match) {
      if (match) {
        // console.log(user.username);
        //set cookies after verified
        req.session.user = {
          user: user.username
        };
        res.redirect('/');
      } else {
        res.send('ERROR: Incorrect username or password.');
      }
    });
  });
});

//GET for new entry
router.get('/entry', function(req, res, next) {
  console.log('req.body.username is ' + req.body.username);
  // console.log('req.session.user is ' + req.session.user);
  //TODO add authorization
  if (req.session.user.user) {
    res.render('entry', {
      title: 'My Guestbook',
      //this does not log the username
      username: req.session.user.user
    });
  } else {
    res.send('User not authorized');
  }
});

//POST route for review
router.post('/entry', function(req, res, next) {
  // var review = req.body.review;
  // console.log(review);
  knex('guests')
    .where('username', 'req.session.user.user')
    .update({
      //TODO figure out why this is not adding to my db
      review: 'Test review'
    });
  res.redirect('../');
});

router.get('/signout', function(req, res) {
  console.log('User is signed out');
  req.session = null;
  res.redirect('../');
});


module.exports = router;
