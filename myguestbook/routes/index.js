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

/* GET home page. */
router.get('/', function(req, res, next) {
  //get all entries in db
  knex('guests').select().then(function(data) {
    console.log(data);
    res.render('index', {
      title: 'My Guestbook',
      username: data[0].username,
      review: data[0].review
    });
  });

});

module.exports = router;
