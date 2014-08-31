#!/usr/bin/env node
var config = require('../../src/conf/config.js');
var logger = require('log'), log = new logger(config.logger.level);
var app = require('../app');
var util = require('../util');

/* give some environment information */
util.dumpEnv();

/* API-server (reseful services) */
app.set('host', util.api_host());
app.set('port', util.api_port());

var apiServer = app.listen(app.get('port'), function() {
  log.info('api server listening on port ' + app.get('host') + ':' + app.get('port'));
});
