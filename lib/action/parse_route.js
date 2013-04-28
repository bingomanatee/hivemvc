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
	if (_DEBUG) console.log('parse route: %s', route);
	var hive = this.get_config('hive');
	var frame = hive.get_config('frame');
	var apiary = this.get_config('apiary');
	var root_route = '';
	var hive_root_route, frame_root_route, apiary_root_route;

	if (hive.config().has('root_route')) {
		hive_root_route = hive.get_config('root_route');
	} else if (frame.config().has('root_route')) {
		frame_root_route = frame.get_config('root_route');
	} else if (apiary.config().has('root_route')) {
		apiary_root_route = apiary.get_config('root_route');
	}

	if (_DEBUG) {
		console.log('hive config: %s', _.keys(hive._config.data));
		console.log('hrr: %s', hive_root_route);
		console.log('frr: %s', frame_root_route);
		console.log('arr: %s', apiary_root_route);

		console.log('path: %s', route);
	}


	var out = _.reduce([apiary_root_route, frame_root_route  , hive_root_route], function (route,replacer) {
		if ((!replacer) || (!/^\*\//.test(route))) {
			return route;
		}
		debugger;
		var out = path.join(replacer,  route.replace('*/', ''));
		if (!/^\//.test(out)){
			out = '/' + out;
		}

		return out;
	}, route);

	if (_DEBUG) 	console.log('out: %s', out);
	return out;

};// end export function