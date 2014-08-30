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
	
	ping: function ping(callback) {
		this.sendAsync({'type':config.udp.message.type.ping, 'message':''}, function(err) {
			if(callback) {
				if(err) {
					callback({'errorcode': '500', 'message': err});
				} else if (callback && !err) {
					callback({'errorcode': '0', 'message': ''});
				}
			}
		});
	},
	
	pong: function pong(callback) {
		this.sendAsync({'type':config.udp.message.type.pong, 'message':''}, function(err) {
			if(callback) {
				if(err) {
					callback({'errorcode': '500', 'message': err});
				} else if (callback && !err) {
					callback({'errorcode': '0', 'message': ''});
				}
			}
		});
	},
	
	advertise: function advertise(callback) {
		this.sendAsync({'type':config.udp.message.type.advertise, 'message':''}, function(err) {
			if(callback) {
				if(err) {
					callback({'errorcode': '500', 'message': err});
				} else if (callback && !err) {
					callback({'errorcode': '0', 'message': ''});
				}
			}
		});
	},
	
};
