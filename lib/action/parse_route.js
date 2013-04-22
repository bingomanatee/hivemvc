var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (route) {
	if (!/^\*/.test(route)) {
		return route;
	}
	console.log('parse route: %s', route);
	var hive = this.get_config('hive');
	var apiary = this.get_config('apiary');
	var root_route = '';

	console.log('hive config: %s', _.keys(hive._config.data));
	if (hive.config().has('root_route')) {
		root_route = hive.get_config('root_route');
	} else {
		if (apiary.config().has('root_route')) {
			root_route = apiary.get_config('root_route');
		}
	}

	if (root_route) {
		route = route.replace(/^\*/, '');
		var out = path.join(root_route, route);
		if (!/^\//.test(out)) {
			out = '/' + out;
		}
	}

	console.log('parsed route: %s', out);
	return out;
};// end export function