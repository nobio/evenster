#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);

var express = require('express');
var udpClient = require('../net/udp-client');
var udpServer = require('../net/udp-server');
var router = express.Router();

module.exports = router;

/* Here goes the API */
router.get('/', function(req, res) {
	res.send("'index', { title: 'XExpress' }");
});

router.get('/ping', function(req, res) {
	udpClient.ping(function(result) {
		res.send(result);
	});
});

router.get('/pong', function(req, res) {
	udpClient.pong(function(result) {
		res.send(result);
	});
});

router.get('/advertise', function(req, res) {
	udpClient.advertise(function(result) {
		res.send(result);
	});
});

router.get('/messages', function(req, res) {
	var msgs = udpServer.getMessages();
	res.send(msgs);
});

router.post('/event', function(req, res) {
	res.send('post /event');
});

router.get('/event', function(req, res) {
	res.send('get /event');
});

router.get('/event:id', function(req, res) {
	res.send('get /event/:id');
});

router.get('/event/filter:criteria', function(req, res) {
	res.send('get /event/filter:criteria');
});
