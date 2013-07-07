var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = true;

var logger = require('node-logger');

/* ************************************
 * This attaches log handler to emitted "log" messages for the apiary.
 *
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (done) {
	var log;
	if (this.has_config('log_file')) {
		var log_file = this.get_config('log_file');
		if (console.log('log file: %s', log_file));
		log = logger.createLogger(log_file);
		log.setLevel('debug');
		this.on('log', function (type, message) {
			if (!message) {
				if (type) {
					console.log('logging type: %s', type);
					log.info(type);
				}
			} else {
				switch (type) {
					case 'info':
						log.info(message);
						break;

					case 'err':
						log.error(message);

						break;

					case 'error':
						log.error(message);
						break;

					case 'debug':
						log.debug(message);
						break;

					default:
						log.info(message);

				}
			}
		});
	}
	done();
}; // end export function