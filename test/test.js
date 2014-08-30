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
				assert.equal('', result.message);
				done();
			});
		});
		
		it('after sending a ping we expect at least one ping message in servers message queue', function(done) {
			udpClient.ping(function(result) {
				sleep(500, function() {
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
					assert.notEqual(typeof found, "undefined", 'at least one ping message had to be found but was not');
					done();
				});
			});
		});
	});
});


/* ================================================================ */
function sleep(millis, callback) {
    setTimeout(function() {
    	callback();
    }, millis);
}