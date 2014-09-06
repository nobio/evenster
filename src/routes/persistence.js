var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var map

/* this is a persistence wrapper; may it be linked to a database or just an in-memory db or a map */
module.exports = {
	
	/**
	 * validates the event object and stores it
	 */
	store: function storeEvent(event, callback) {
		log.debug('storing event now');
		callback();
	},
};