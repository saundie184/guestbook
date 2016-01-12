var express = require('express');
var router = express.Router();

//set up knex
var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'guestbook',
    username: 'SaundieWeiss'
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/guestbook', function(req, res) {
//add authorization here to view all guestbook enteries
      knex('guests').select().then(function(guests) {
          res.render('guestbook', {
            title: 'My Guestbook',
            data: req.body
          });
        });
      });

//POST route, add authorization to

    module.exports = router;
