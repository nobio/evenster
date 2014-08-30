#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var multicastServer = require('dgram');
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

	if(msg && msg.type == config.udp.message.type.ping) {
		udpClient.pong(function(result) {
			log.info(result);	
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
	getQueue: function getMessages() {
		return queue;
	},
		
	popMessage: function popMessage() {
		return queue.shift();
	},
		
}