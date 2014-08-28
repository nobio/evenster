var express = require('express');
var udpClient = require('../net/udp-client');
var router = express.Router();

module.exports = router;

/* Here goes the API */
router.get('/', function(req, res) {
  res.send("'index', { title: 'XExpress' }");
});

router.get('/ping', function(req, res) {
  udpClient.ping();
  res.send(200);
});

