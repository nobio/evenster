#!/usr/bin/env node
var config = require('..//src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var assert = require("assert");
var udpClient = require('../src/net/udp-client');

describe('UDP Client', function() {
	describe('#ping()', function() {
		it('sync ping should return no return value', function() {
			var httpcode = udpClient.ping();
			assert.equal(undefined, httpcode);
		});
		it('async ping should return return no error (code=200)', function(done) {
			udpClient.ping(function(result) {
				assert.equal('0', result.errorcode);
				assert.equal('', result.message);
				done();
			});
		});
	});
});


