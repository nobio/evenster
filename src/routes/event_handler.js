var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var validator = require("./validator");
var persistence = require("./persistence");


//var regexIp = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
//var regexHost = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");

/* export some functions */
module.exports = {
	
	/**
	 * validates the event object and stores it
	 */
	storeEvent: function storeEvent(event, callback) {
		
		validator.validate(event, function(err) {
			if(err) {
				callback(err);
			} else {
			
				// persist the event
				persistence.store(event, function(err) {
					callback(err);
				});
				
			}
		});
		
	},
	
	/**
	 * load all events
	 */
	loadAllEvents: function loadAllEvents(callback) {
		persistence.loadAll(function(result, err) {
			callback(result, err);
		});
	}

};


