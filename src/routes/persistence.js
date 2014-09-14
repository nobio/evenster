var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var fs =     require('fs');
var alfred = require('alfred');

var PATH_TO_DB =  config.persistence.path_to_db;
var Event;

// make sure a folder where alfred stores data exists
if (!fs.existsSync(PATH_TO_DB)) {
    fs.mkdirSync(PATH_TO_DB);
}

log.info('opening alfred database...');
alfred.open(PATH_TO_DB, function(err, db) {
  	if (err) { 
  		throw(err);
  	}
	log.info('alfred database is open...');
	Event = createEventModel(db);

	db.on('error', function(err) {
  		log.info(err);
	});
	db.on('key_map_attached', function(key_map_name) {
  		log.info('key_map_attached: ' + key_map_name);
	});
	db.on('index_added', function(key_map_name, index_name) {
  		log.info('index_added: ' + key_map_name + " " + index_name);
	});
	db.on('index_dropped', function(key_map_name, index_name) {
  		log.info('index_dropped: ' + key_map_name + " " + index_name);
	});
	
});


/* this is a persistence wrapper; may it be linked to a database or just an in-memory db or a map */
module.exports = {
	
	/**
	 * validates the event object and stores it
	 */
	store: function storeEvent(evt, callback) {
		log.debug('storing event now...');
		log.debug('new Event model created');
		var event = Event.new({
			application_id: evt.event.header.application_id, 
			source_host:    evt.event.header.source_host,
			timestamp:      evt.event.header.timestamp,
			event_type:     evt.event.header.event_type,
			payload:        evt.event.payload.data,
		});
		log.debug('new Event model filled');
		
		event.save(function(validationErrors) {
			callback(validationErrors);
		});
	}
};

function createEventModel(db) {
	var model = db.define('Event', {
		buffered: true, 
		type: 'cached_key_map', 
		flush_interval: config.persistence.flush_interval,
		cache_slots: 1000
	});
	model.property('application_id', 'string', { required: true, maxLength: 100 });
	model.property('source_host', 'string', { required: true, maxLength: 100 });
	model.property('timestamp', 'string', { required: true });
	model.property('event_type', 'string', { required: true });
	model.property('payload', 'string', { required: true });
	
	model.index('application_id', function(event) {
		return event.application_id;
	});
	model.index('source_host', function(event) {
		return event.source_host;
	});
	model.index('timestamp', function(event) {
		return event.timestamp;
	});
	model.index('event_type', function(event) {
		return event.event_type;
	});

	return model;
}