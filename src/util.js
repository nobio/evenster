var config = require('../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var ip = require('ip');
var os = require("os");

module.exports = {
	api_host: function api_host() {
		return process.env.IP || process.env.OPENSHIFT_NODEJS_IP || ip.address();
	},

	api_port: function api_port() {
		return process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '3000';
	},

   api_domain: function api_domain() {
		return 'http://' + this.api_host() + ":" + this.api_port() + '/api';
	},

	dumpEnv: function dumpEnv() {
		log.info('local ip address: %s', ip.address());
		log.info('local domain: %s', this.api_domain());
		log.info('host name: %s running on os "%s", platform "%s"', os.hostname(), os.type(), os.platform());
		log.info('CPU: "%s", release "%s", uptime: "%s", load: "%s"', os.arch(), os.release(), os.uptime(), os.loadavg())
	},
	
	sleep: function sleep(millis, callback) {
    	setTimeout(function() {
    		callback();
    	}, millis);
	},
	
	sleepSync: function(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	},
}
