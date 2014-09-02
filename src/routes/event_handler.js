var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);

/* export some functions typically for a udp client */
module.exports = {
	
	/**
	 * validates the event object and stores it
	 */
	storeEvent: function storeEvent(event, callback) {
		validateEvent(event, function(err) {
			callback(err);
		});
	},

};

/* ========================================================== */
function validateEvent(event, callback) {
	log.debug(event);
	callback(undefined);
}
