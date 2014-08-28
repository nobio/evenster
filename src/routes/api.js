var express = require('express');
var router = express.Router();

module.exports = router;

/* Here goes the API */
router.get('/', function(req, res) {
  res.send("'index', { title: 'XExpress' }");
});

router.get('/test', function(req, res) {
  res.send(500, 'So ein Mist');
});

