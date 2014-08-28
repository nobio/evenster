#!/usr/bin/env node
var logger = require('log'), log = new logger('debug');
var config = require('../../src/conf/config.js');
var udpServer = require('dgram');

/* UDP-server (broadcast) */
var socket = udpServer.createSocket("udp4");

socket.on("error", function (err) {
  log.info("udp server error:\n" + err.stack);
  socket.close();
});

socket.on("message", function (msg, rinfo) {
  log.info("udp server received: '" + msg + "' from " + rinfo.address + ":" + rinfo.port);
});

socket.on("listening", function () {
  var address = socket.address();
  log.info("udp server listening " + address.address + ":" + address.port);
});

socket.bind(config.udp.server.port);

