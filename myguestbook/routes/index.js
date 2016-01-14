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
    // console.log(data[0].review);
    res.render('index', {
      title: 'My Guestbook',
      //TODO add conditionals to ejs to only show if there is a review to post
      data: data
    });
  });

});

module.exports = router;
