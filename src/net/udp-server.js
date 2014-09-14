#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var multicastServer = require('dgram');
var util = require('../util');
var udpClient = require('./udp-client');
var queue = new Array();

/* UDP-server (broadcast) */
var socket = multicastServer.createSocket("udp4");

socket.on("error", function (err) {
	log.info("udp server error:\n" + err.stack);
	socket.close();
});

socket.on("message", function (sMsg, rinfo) {
	log.info("udp server received: '" + sMsg + "' from " + rinfo.address + ":" + rinfo.port);
	var msg = JSON.parse(sMsg);
	
	// add expire timestamp to the message
	msg.expire = Date.now() + parseInt(config.queue.expire);

	if(msg && msg.type == config.udp.message.type.advertise) {
		udpClient.advertisement(getAdvertisement(), function(result) {
			log.debug(result);	
		});
	} else if (msg && msg.type == config.udp.message.type.advertisement) {
		// nothing to do
	} else if(msg && msg.type == config.udp.message.type.ping) {
		udpClient.pong(function(result) {
			log.debug(result);	
		});
	} else if(msg && msg.type == config.udp.message.type.pong) {
		// nothing to do
	}
	
	queue.push(msg); 
});

socket.on("listening", function () {
	socket.setBroadcast(true)
	socket.setMulticastTTL(128); 
	socket.addMembership(config.udp.server.host);
	var address = socket.address();
	log.info("udp server listening " + address.address + ":" + address.port);
});

log.info("trying to bind udp server to " + config.udp.server.host + ":" + parseInt(config.udp.server.port));
socket.bind(parseInt(config.udp.server.port), config.udp.server.host);

/* export some functions typically for a udp client */
module.exports = {
	getMessages: function getMessages() {
		return queue;
	},
		
	getMessagesByType: function getMessagesByType(type) {
		if(type == config.udp.message.type.advertisement) {
			return queue.filter(hasTypeAdvertisement);
		} else if(type == config.udp.message.type.advertise) {
			return queue.filter(hasTypeAdvertise);
		} else if(type == config.udp.message.type.ping) {
			return queue.filter(hasTypePing);
		} else {
			return new Array();
		}
	},
		
	pushMessage: function pushMessage(obj) {
		queue.push(obj);	
	},
	
	shift: function shift() { // FIFO
		return queue.shift();
	},
		
	pop: function pop() { // LIFO
		return queue.pop();
	},
}

/* ========================================================== */
function hasTypeAdvertisement(element) {
	return element.type == config.udp.message.type.advertisement;
}
function hasTypeAdvertise(element) {
	return element.type == config.udp.message.type.advertise;
}
function hasTypePing(element) {
	return element.type == config.udp.message.type.ping;
}
function hasExpired(element) {
	return element.expire > Date.now();
}

function getAdvertisement() {
	var urlPrefix = "http://" + util.api_host() + ":" + util.api_port();
	var advert = 
	{
		type: config.udp.message.type.advertisement, 
		advertisement: 
			{
				api_server: 
				{
					host: util.api_host(),
					port: util.api_port()
				},
				event_post_endpoint: urlPrefix + "/api/event",
				endpoints:
				[
					{
						operation: urlPrefix + "/api/ping"
					},
					{
						operation: urlPrefix + "/api/messages"
					},
					{
						operation: urlPrefix + "/api/advertise"
					},
					{
						operation: urlPrefix + "/api/event/:id"
					},
					{
						operation: urlPrefix + "/api/event/filter/:criteria"
					},
				]
			},
	};
	return advert;
}

/* clean queue due to expire date */
setInterval(function () {
	var sizeBefore = queue.length;
	queue = queue.filter(hasExpired);
	log.debug('cleaning queue... %s elements removed - left %s elements', sizeBefore - queue.length, queue.length);
}, parseInt(config.queue.expire));