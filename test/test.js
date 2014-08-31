#!/usr/bin/env node
var config = require('..//src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var assert = require("assert");
var udpClient = require('../src/net/udp-client');
var udpServer = require('../src/net/udp-server');
var util = require("../src/util");

describe('#ping()', function() {
	it('sync ping should return no return value', function(done) {
		var httpcode = udpClient.ping();
		assert.equal(undefined, httpcode);
		done();
	});
	
	it('async ping should return return no error (code=200)', function(done) {
		udpClient.ping(function(result) {
			assert.equal('0', result.errorcode);
			assert.equal('ok', result.message);
			done();
		});
	});
});
		
describe('#message queue', function() {
	it('after sending a ping we expect at least one ping message in servers message queue', function(done) {
		udpClient.ping(function(result) {
			util.sleep(500, function() {
				var found, msg;
				var messages = udpServer.getMessages();
				for (var i = 0; i < messages.length; i++) {
					msg = messages[i];
					log.debug(msg);
					if(msg.type == config.udp.message.type.ping) {
						found = msg;
						break;
					}
				}
				assert.notEqual(undefined, found, 'at least one ping message had to be found but was not');
				done();
			});
		});
	});
	
	it('push and shift (FIFO) a value to the queue', function(done) {
		udpServer.getMessages().length = 0; // reset the queue

		assert.equal(0, udpServer.getMessages().length);
		
		udpServer.pushMessage({'type':'TEST-DO-NOT-USE-1'});
		assert.equal(1, udpServer.getMessages().length);
		udpServer.pushMessage({'type':'TEST-DO-NOT-USE-2'});
		assert.equal(2, udpServer.getMessages().length);

		var msg = udpServer.shift();
		assert.equal(1, udpServer.getMessages().length);
		assert.equal(msg.type, 'TEST-DO-NOT-USE-1');
		
		msg = udpServer.shift();
		assert.equal(0, udpServer.getMessages().length);
		assert.equal(msg.type, 'TEST-DO-NOT-USE-2');
		
		msg = udpServer.shift();
		assert.equal(undefined, msg, 'reading from an empty queue must return undefined value but returned %s', msg);
		
		done();
	});

	it('push and pop (LIFO) a value to the queue', function(done) {
		udpServer.getMessages().length = 0; // reset the queue

		assert.equal(0, udpServer.getMessages().length);
		
		udpServer.pushMessage({'type':'TEST-DO-NOT-USE-1'});
		assert.equal(1, udpServer.getMessages().length);
		udpServer.pushMessage({'type':'TEST-DO-NOT-USE-2'});
		assert.equal(2, udpServer.getMessages().length);

		var msg = udpServer.pop();
		assert.equal(1, udpServer.getMessages().length);
		assert.equal(msg.type, 'TEST-DO-NOT-USE-2');
		
		msg = udpServer.pop();
		assert.equal(0, udpServer.getMessages().length);
		assert.equal(msg.type, 'TEST-DO-NOT-USE-1');
		
		msg = udpServer.pop();
		assert.equal(undefined, msg, 'reading from an empty queueu must return undefined value but returned %s', msg);
		
		done();
	});

});

describe('#advertise', function() {
	it('advertise call should be found in the messages queue', function(done) {
		udpServer.getMessages().length = 0; // reset the queue
	
	
		// do some udp calls
		udpClient.ping();
		udpClient.ping();
		udpClient.advertise();
		udpClient.ping();
		udpClient.advertise();
		udpClient.ping();
		udpClient.ping();

		util.sleep(500, function() { // give the server the chance to fetch the messages
			var messages = udpServer.getMessagesByType(config.udp.message.type.advertise);
			log.debug("Advertise messages found: %s", JSON.stringify(messages));
			assert.equal(2, messages.length)
			
			messages = udpServer.getMessagesByType(config.udp.message.type.ping);
			log.debug("Ping messages found: %s", JSON.stringify(messages));
			assert.equal(5, messages.length)
			
			done();
		});
	});

	it('advertise call should generate an advertisement reply', function(done) {
		udpServer.getMessages().length = 0; // reset the queue
		udpClient.advertise();
		util.sleep(100, function() { // give the server the chance to fetch the messages
			var messages = udpServer.getMessagesByType(config.udp.message.type.advertisement);
			log.debug("Advertisement messages found: %s", JSON.stringify(messages));
			assert.ok(1 <= messages.length);
			var adv = messages[0];
			assert.equal(config.udp.message.type.advertisement, adv.type);
			assert.notEqual(undefined, adv.advertisement.api_server.host);
			assert.notEqual(undefined, adv.advertisement.api_server.port);
			
			done();
		});
	});

});
		
