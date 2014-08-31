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

	dumpEnv: function dumpEnv() {
		log.info('local ip address: %s', ip.address());
		log.info('host name: %s running on os "%s", platform "%s"', os.hostname(), os.type(), os.platform());
		log.info('CPU: "%s", release "%s", uptime: "%s", load: "%s"', os.arch(), os.release(), os.uptime(), os.loadavg())
	}	
}