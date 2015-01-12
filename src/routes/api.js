#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);

var express = require('express');
var udpClient = require('../net/udp-client');
var udpServer = require('../net/udp-server');
var eventHandler = require('./event_handler');
var router = express.Router();

module.exports = router;

/* Here goes the API */
router.get('/', function(req, res) {
	res.send(udpServer.getAdvertisement());
});

/* a ping message is sent via broadcast; we expect to initiate a pong answer from all listening evenster servers */
router.get('/ping', function(req, res) {
	udpClient.ping(function(err) {
		if(err) {
			res.send(500, err.message);
		} else {
			res.send(200);
		}
	});
});

/* answer to ping sent as broadcast */
router.get('/pong', function(req, res) {
	udpClient.pong(function(err) {
		if(err) {
			res.send(500, err.message);
		} else {
			res.send(200);
		}
	});
});

/* advertise message: should be sent by real evenster clients in order 
   to receive all necessary data to connect to the evenster server(s); 
   please mind that all servers might respond since this initiates a broadcast */
router.get('/advertise', function(req, res) {
	udpClient.advertise(function(err) {
		if(err) {
			res.send(500, err.message);
		} else {
			res.send(200);
		}
	});
});

/* reads all multicast messages from the buffer */
router.get('/multicast-messages', function(req, res) {
	var msgs = udpServer.getMessages();
	res.send(msgs);
});

/** 
 * receives an event to store in persistence layer 
 * curl -X POST -H "Content-Type: application/json" -d '{"event": { "header": { "application_id":"calvin_de", "event_type":"cash-transfer", "source_host": "10.207.131.20"}, "payload": {"data": "<request>MWOrdAdd</request>"}}}' http://localhost:8080/api/event
 */
router.post('/event', function(req, res) {
	eventHandler.storeEvent(req.body, function(err) {
		if(err) {
			res.send(500, err.message);
		} else {
			res.send(200);
		}
	});
});

/* read a special event by it's id */
router.get('/event/:id', function(req, res) {
	res.send('get /event with id="' + req.params.id +'"');
});

/* get a list of events by criteria */
router.get('/event/filter/:criteria', function(req, res) {
	// req.body.criteria
	res.send('get /event/filter/:criteria');
});

/**
 * read all events 
 * curl -X GET http://localhost:8080/api/events
 */
router.get('/events', function(req, res) {
	eventHandler.loadAllEvents(function(err, result) {
		if(err) {
			res.send(500, err.message);
		} else {
			res.send('number of events: ' + result.length + '\n');
		}
	});
});

