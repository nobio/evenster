#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var app = require('../app');

/* API-server (reseful services) */
app.set('host', process.env.IP   || process.env.OPENSHIFT_NODEJS_IP   || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '3000');

var apiServer = app.listen(app.get('port'), function() {
  log.info('api server listening on port ' + app.set('host') + ':' + app.set('port'));
});
