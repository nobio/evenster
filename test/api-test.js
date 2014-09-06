#!/usr/bin/env node
var config = require('..//src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var assert = require("assert");
var udpClient = require('../src/net/udp-client');
var udpServer = require('../src/net/udp-server');
var util = require("../src/util");
var eventHandler = require("../src/routes/event_handler.js");

describe('#ping()', function() {
	it('sync ping should return no return value', function(done) {
		var httpcode = udpClient.ping();
		assert.equal(undefined, httpcode);
		done();
	});
	
	it('async ping should return return no error (code=200)', function(done) {
		udpClient.ping(function(err) {
			assert.equal(undefined, err);
			done();
		});
	});
});
		

describe('#validate()', function() {
	it('send an valid object; should not be rejected', function(done) {
		var event =
		{event: {
			header: {
				source_host: '10.207.131.20',
				timestamp: 123456367,
				event_type: 'cash-transfer'
			},
			payload: {
				data: '<request><test>asdasd</test></request>'
			}
		}};
		
		eventHandler.validate(event, function(err) {
			assert.equal(undefined, err, "we expect an error on an intentionallyinvalid message");	
			done();
		});
	});
	it('send an invalid object: blank event.header.source_host; should be rejected', function(done) {
		var event =
		{event: {
			header: {
				//source_host: '10.207.131.20',
				timestamp: 123456367,
				event_type: 'cash-transfer'
			},
			payload: {
				data: '<request><test>asdasd</test></request>'
			}
		}};
		
		eventHandler.validate(event, function(err) {
			assert.notEqual(undefined, err, "we expect an error on an intentionally invalid message");	
			done();
		});
	});
	it('send an invalid object: blank event.header.timestamp; should be rejected', function(done) {
		var event =
		{event: {
			header: {
				source_host: '10.207.131.20',
				//timestamp: 123456367,
				event_type: 'cash-transfer'
			},
			payload: {
				data: '<request><test>asdasd</test></request>'
			}
		}};
		
		eventHandler.validate(event, function(err) {
			assert.notEqual(undefined, err, "we expect an error on an intentionally invalid message");	
			done();
		});
	});
	it('send an invalid object: invalid event.header.timestamp; should be rejected', function(done) {
		var event =
		{event: {
			header: {
				source_host: '10.207.131.20',
				timestamp: 'Hallo',
				event_type: 'cash-transfer'
			},
			payload: {
				data: '<request><test>asdasd</test></request>'
			}
		}};
		
		eventHandler.validate(event, function(err) {
			assert.notEqual(undefined, err, "we expect an error on an intentionally invalid message");	
			done();
		});
	});
	it('send an invalid object: blank event.header.event_type; should be rejected', function(done) {
		var event =
		{event: {
			header: {
				source_host: '10.207.131.20',
				timestamp: 123456367,
				//event_type: 'cash-transfer'
			},
			payload: {
				data: '<request><test>asdasd</test></request>'
			}
		}};
		
		eventHandler.validate(event, function(err) {
			assert.notEqual(undefined, err, "we expect an error on an intentionally invalid message");	
			done();
		});
	});
	it('send an invalid object: blank event.payload.data; should be rejected', function(done) {
		var event =
		{event: {
			header: {
				source_host: '10.207.131.20',
				timestamp: 123456367,
				event_type: 'cash-transfer'
			},
			payload: {
				//data: '<request><test>asdasd</test></request>'
			}
		}};
		
		eventHandler.validate(event, function(err) {
			assert.notEqual(undefined, err, "we expect an error on an intentionally invalid message");	
			done();
		});
	});
	it('send an invalid object: just any json; should be rejected', function(done) {
		var event =
		{xxx: {
			yyy: {
				zzz: 'asd'
			},
			aaa: {
				bbb: 'asd'
			}
		}};
		
		eventHandler.validate(event, function(err) {
			assert.notEqual(undefined, err, "we expect an error on an intentionally invalid message");	
			done();
		});
	});
});
		
