#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);

var multicastServer = require('dgram');


/* export some functions typically for a udp client */
module.exports = {
	
	sendAsync: function sendAsync(msg, callback) {
		var sMsg = JSON.stringify(msg);
		var message = new Buffer(sMsg);

		log.debug('Message to be sent: %s (on multicast address %s:%s)', sMsg, config.udp.server.host, config.udp.server.port);

		var client = multicastServer.createSocket("udp4");
		client.send(message, 0, message.length, parseInt(config.udp.server.port), config.udp.server.host, function(err, bytes) {
			client.close();
			callback(err);
		});
	},
	
	/**
	 * functions without sending any payload except the 
	 * message type: ping, pong, advertise
	 */ 
	ping: function ping(callback) {
		this.sendAsync({'type':config.udp.message.type.ping}, function(err) {
			if(callback) {
				if(err) {
					callback({'errorcode': '500', 'message': err});
				} else if (callback && !err) {
					callback({'errorcode': '0', 'message': 'ok'});
				}
			}
		});
	},
	
	pong: function pong(callback) {
		this.sendAsync({'type':config.udp.message.type.pong}, function(err) {
			if(callback) {
				if(err) {
					callback({'errorcode': '500', 'message': err});
				} else if (callback && !err) {
					callback({'errorcode': '0', 'message': 'ok'});
				}
			}
		});
	},
	
	/**
	 * request an advertisment object that declares everything the event client
	 * needs to connect to this event server
	 */ 
	advertise: function advertise(callback) {
		this.sendAsync({'type':config.udp.message.type.advertise}, function(err) {
			if(callback) {
				if(err) {
					callback({'errorcode': '500', 'message': err});
				} else if (callback && !err) {
					callback({'errorcode': '0', 'message': 'ok'});
				}
			}
		});
	},
	
	/**
	 * responsd to an advertisment with an advertisement object that declares everything the event client
	 * needs to connect to this event server
	 */ 
	advertisement: function advertisement(advertisement, callback) {
		this.sendAsync(advertisement, function(err) {
			if(callback) {
				if(err) {
					callback({'errorcode': '500', 'message': err});
				} else if (callback && !err) {
					callback({'errorcode': '0', 'message': 'ok'});
				}
			}
		});
	},
	
};
