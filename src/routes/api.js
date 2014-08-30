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

