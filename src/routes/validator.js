var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var assert = require("assert");


//var regexIp = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
//var regexHost = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");

/* export some functions */
module.exports = {
	
	/**
	 * validates the event object and stores it
	 */
	validate: function (event, callback) {
		var value;
		var err;
		
		try {
			value = event.event;
			assert.notEqual(undefined, value, 'event must be defined');
			
			value = event.event.header;
			assert.notEqual(undefined, value, 'event.header must be defined');
			
			value = event.event.header.application_id;
			assert.notEqual(undefined, value, 'header.application_id must be defined');
			
			value = event.event.header.timestamp;
			assert.notEqual(undefined, value, 'header.timestamp must be defined');
			assert.ok(isDate(value) || isNumeric(value), 'header.timestamp must be a date');
		
			value = event.event.header.source_host;
			assert.notEqual(undefined, value, 'header.source_host must be defined');
//			assert.ok(regexIp.test(value) || regexHost.test(value));
		
			value = event.event.header.event_type;
			assert.notEqual(undefined, value, 'header.event_type must be defined');
		
			value = event.event.payload;
			assert.notEqual(undefined, value, 'payload must be defined');
			
			value = event.event.payload.data;
			assert.notEqual(undefined, value, 'payload.data must be defined');
			
		} catch(ex) {
			log.error(ex);
			err = ex;
		}
		callback(err);
	},
	
};


/* ========================================================== */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isDate(d) {
	return d instanceof Date && !isNaN(d.valueOf())
}

