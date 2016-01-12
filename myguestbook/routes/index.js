var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'My Guestbook',
    username: req.body.username,
    review: req.body.review
  });
});

module.exports = router;
