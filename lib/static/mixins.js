var fs = require('fs');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var path = require('path');
var Model = require('./../model');
var prefixes = Model.list.get('_static_prefixes');

module.exports = {

	/**
	 *
	 * @param path - a full disk path
	 * @param alias - the uri prefix to all files therein
	 *
	 */
	map: function (path, alias) {
		if (_DEBUG) {
			console.log('mapping %s to %s', path, alias);
		}
		prefixes.put({prefix: path, alias: alias});
	}

};