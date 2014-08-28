#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var udpServer = require('dgram');
var udpClient = require('./udp-client');


/* UDP-server (broadcast) */
var socket = udpServer.createSocket("udp4");

socket.on("error", function (err) {
  log.info("udp server error:\n" + err.stack);
  socket.close();
});

socket.on("message", function (sMsg, rinfo) {
  log.info("udp server received: '" + sMsg + "' from " + rinfo.address + ":" + rinfo.port);
  var msg = JSON.parse(sMsg);
  if(msg && msg.type == config.udp.message.type.ping) {
    udpClient.pong();
  } else if(msg && msg.type == config.udp.message.type.pong) {
    // nothing to do
  } 
});

socket.on("listening", function () {
  var address = socket.address();
  log.info("udp server listening " + address.address + ":" + address.port);
});

socket.bind(config.udp.server.port);

