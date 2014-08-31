#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var app = require('../app');
var ip = require('ip');
var os = require('os');

/* API-server (reseful services) */
log.info('local ip address: %s', ip.address());
log.info('host name: %s running on os "%s", platform "%s"', os.hostname(), os.type(), os.platform());
log.info('CPU: "%s", release "%s", uptime: "%s", load: "%s"', os.arch(), os.release(), os.uptime(), os.loadavg())

app.set('host', process.env.IP   || process.env.OPENSHIFT_NODEJS_IP   || ip.address());
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '3000');

var apiServer = app.listen(app.get('port'), function() {
  log.info('api server listening on port ' + app.set('host') + ':' + app.set('port'));
});
