#!/usr/bin/env node
var logger = require('log'), log = new logger('debug');
var config = require('../../src/conf/config.js');

var udpServer = require('dgram');
var socket = udpServer.createSocket("udp4");


/* export some functions typically for a udp client */
module.exports = {
  
  sendAsync: function send(msg, callback) {
	var message = new Buffer(msg);
	var client = udpServer.createSocket("udp4");
	client.send(message, 0, message.length, config.udp.server.port, "localhost", function(err, bytes) {
   		client.close();
		if(!err) {
			callback(err);
		} else {
			callback();
		}
	});
  },
  
  ping: function ping() {
  	var code = this.sendAsync(config.udp.message.type.ping, function(err) {
  		if(err) {
  			return 500;
  		} else {
  			return 200;
  		}
  	});
  }
  
};