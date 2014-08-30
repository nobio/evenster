#!/usr/bin/env node
var config = require('..//src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var assert = require("assert");
var udpClient = require('../src/net/udp-client');
var udpServer = require('../src/net/udp-server');

describe('UDP Client', function() {
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
				sleep(0, function() {
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
			udpServer.getMessages().length = 0;

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
			assert.equal(undefined, msg, 'reading from an empty queueu must return undefined value but returned %s', msg);
			
			done();
		});

		it('push and pop (LIFO) a value to the queue', function(done) {
			udpServer.getMessages().length = 0;

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
});


/* ================================================================ */
function sleep(millis, callback) {
    setTimeout(function() {
    	callback();
    }, millis);
}