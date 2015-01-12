var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var mongoose = require('mongoose');

//===================================== INITIALISATION =====================================//
console.log("init mongodb database");

// Event Model
var schema   = mongoose.Schema;
var _Event = new schema({
	application_id: {type: String, required: true, default: 'unknown', index: true, unique: false}, 
	source_host:    {type: String, required: true, default: 'unknown', index: true, unique: false}, 
	timestamp:      {type: Date, required: true, default: Date.now, index: true, unique: false}, 
	event_type:     {type: String, required: true, default: 'unknown', index: true, unique: false}, 
	payload:        {type: String, required: true, default: 'unknown', index: false, unique: false} 
});
mongoose.model('Event', _Event);
var Event = mongoose.model('Event');


var mongodb_url = 'mongodb://event:QHH-qeG-mAS-4sK@ds029901.mongolab.com:29901/event';

var options = {
	db: { native_parser: true },
	server: { poolSize: 2 },
	server: { socketOptions: { keepAlive: 1 } },
	replset: { socketOptions: { keepAlive: 1 } }
}

console.log('connecting to mongodb on ' + mongodb_url + ' with options ' + JSON.stringify(options));
mongoose.connect(mongodb_url, options);
console.log('connected to mongodb');

//===================================== END OF INITIALISATION =====================================//

/* this is a persistence wrapper; may it be linked to a database or just an in-memory db or a map */
module.exports = {
	
	/**
	 * validates the event object and stores it
	 */
	store: function storeEvent(evt, callback) {
		log.debug('storing event now: %s', JSON.stringify(evt));
		new Event({
			application_id: evt.event.header.application_id, 
			source_host:    evt.event.header.source_host,
			timestamp:      isNaN(evt.event.header.timestamp) ? Date.now() : evt.event.header.timestamp,
			event_type:     evt.event.header.event_type,
			payload:        evt.event.payload.data
		}).save(function(err, storedEvent) {
			if(err) {
				callback(err);
			} else {
				log.debug('event saved: ' + storedEvent);
				callback(null);
			}
		});
		log.debug('new Event model filled');
	},
	
	loadAll: function(callback) {
		Event.find(function(err, events) {
			callback(err, events);
		});
	}
};

