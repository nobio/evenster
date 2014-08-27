var express = require('express');
var router = express.Router();

/* Here goes the API */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
