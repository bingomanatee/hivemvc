var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */
var star_re = /^(\/)?\*\//;

/* ********* EXPORTS ******** */

module.exports = function (route) {
	if (!star_re.test(route)) {
		return route;
	}
	if (_DEBUG) console.log('parse route: %s', route);
	var hive = this.get_config('hive');
	var frame = hive.get_config('frame');
	var apiary = this.get_config('apiary');
	var base_route = '';
	var hive_base_route, frame_base_route, apiary_base_route;

	if (hive.config().has('base_route')) {
		hive_base_route = hive.get_config('base_route');
	}

	if (frame.config().has('base_route')) {
		frame_base_route = frame.get_config('base_route');
	}

	if (apiary.config().has('base_route')) {
		apiary_base_route = apiary.get_config('base_route');
	}

	if (_DEBUG) {
		console.log('hive config: %s', _.keys(hive._config.data));
		console.log('hrr: %s', hive_base_route);
		console.log('frr: %s', frame_base_route);
		console.log('arr: %s', apiary_base_route);

		console.log('path: %s', route);
	}

	var out = _.reduce(_.compact([hive_base_route, frame_base_route  , apiary_base_route]), function (route, replacer) {
		if (!star_re.test(route)) {
			if (_DEBUG)        console.log('no star; returning %s', route);
			return route;
		}

		var out = path.join(replacer, route.replace(star_re, ''));
		if (_DEBUG)    console.log('turned route  %s into %s', route, out);
		if (!star_re.test(out) && (!/^\//.test(out))) {
			out = '/' + out;
			if (_DEBUG)        console.log('barring out: %s', out);
		}

		return out;
	}, route);

	if (_DEBUG)    console.log('out: %s', out);
	return out;

};// end export function