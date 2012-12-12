var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = false;

/**
 * deprecated - only actions serve
 * @param app
 */
module.exports = function(app){
    var mvc = require('./../../index');

	function _serve_hive(hive){
		if (!hive.TYPE == 'hive'){
			throw new Error('non hive in hive list: %s', util.inspect(hive));
		}
		hive.serve(app);
	}

	mvc.on('hive', _serve_hive);

	_.each(mvc.Hive.list.all(), _serve_hive);

};