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
	var hive = this.get_config('hive');
	var apiary = this.get_config('apiary');
	var route_root = '';

	if (hive.has_config('route_root')) {
		route_root = hive('route _root');
	} else {
		if (apiary.config().has('route_root')){
			route_root = apiary.get_config('route_root');
		}
	}

	return route.replace(/\^*/, route_root);
};// end export function