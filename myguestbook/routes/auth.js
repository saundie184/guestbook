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
  // console.log(req.body);
  //TODO add more validation for fields

  // if(req.body.firstname)

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
          req.session = {
            user: req.body.username
          }).then(
          res.redirect('/'));

        //this should automatically sign them in

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
        //set cookies after verified
        req.session.user = {
          user: user.username
        };
        //redirect user to homepage
        res.redirect('../');
      } else {
        res.send('ERROR: Incorrect username or password.');
      }
    });
  });
});

//GET for new entry
router.get('/entry', function(req, res, next) {
  // console.log('req.body.username is ' + req.body.username);
  console.log('req.session.user.user is ' + req.session.user);

  //TODO add error-handling here if user is not signed in
  if (req.session.user.user) {
    res.render('entry', {
      title: 'My Guestbook',
      username: req.session.user.user
    });
  } else {

    res.send('User not authorized');
  }
});

//POST route for review
router.post('/entry', function(req, res, next) {
  // console.log(req.body.review);
  // console.log(req.session.user.user);
  knex('guests')
    .update({
      review: req.body.review
    })
    .where({
      username: req.session.user.user
    })
    .then(function(resp) {
      //redirect page after you update the db
      // console.log(resp);
      res.redirect('../');
    }).catch(function(err) {
      console.log(err);
      res.send('BLah');
    });
});

//POST route to edit entry
router.get('/entry/:id/edit', function(req, res, next) {
  console.log(req.session.user.review); // {id: 5}
  knex('guests').select().where({
    id: req.params.id
  }).then(function(resp){
    console.log(resp);
    res.render('entry', {
      title: 'Edit entry',
      username: req.session.user.user,
      //TODO add conditionals in ejs to figure this out
      review: res[0].review
    });
  }).catch(function(err){
    console.log('ERROR: ' + err);
    res.send('ERROR!');
  });
});

router.get('/signout', function(req, res) {
  console.log('User is signed out');
  req.session = null;
  res.redirect('../');
});


module.exports = router;
