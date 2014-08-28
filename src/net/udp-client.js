#!/usr/bin/env node
var logger = require('log'), log = new logger('debug');
var config = require('../../src/conf/config.js');

var udpServer = require('dgram');
var socket = udpServer.createSocket("udp4");

module.exports = {
  
  sendAsync: function send(msg) {
	var message = new Buffer(msg);
	var client = udpServer.createSocket("udp4");
	client.send(message, 0, message.length, config.udp.server.port, "localhost", function(err, bytes) {
   		client.close();
	});
  }
  
};