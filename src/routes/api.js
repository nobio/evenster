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

/* a ping message is sent via broadcast; we expect to initiate a pong answer from all listening evenster servers */
router.get('/ping', function(req, res) {
	udpClient.ping(function(result) {
		res.send(result);
	});
});

/* answer to ping sent as broadcast */
router.get('/pong', function(req, res) {
	udpClient.pong(function(result) {
		res.send(result);
	});
});

/* advertise message: should be sent by real evenster clients in order 
   to receive all necessary data to connect to the evenster server(s); 
   please mind that all servers might respond since this initiates a broadcast */
router.get('/advertise', function(req, res) {
	udpClient.advertise(function(result) {
		res.send(result);
	});
});

/* reads all multicast messages from the buffer */
router.get('/multicast-messages', function(req, res) {
	var msgs = udpServer.getMessages();
	res.send(msgs);
});

/* receives an event to store in persistence layer */
router.post('/event', function(req, res) {
	res.send('post /event');
});

/* read a special event by it's id */
router.get('/event:id', function(req, res) {
	res.send('get /event/:id');
});

/* get a list of events by criteria */
router.get('/event/filter:criteria', function(req, res) {
	res.send('get /event/filter:criteria');
});
