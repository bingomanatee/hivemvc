var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = true;

module.exports = function(app){
    var mvc = require('./../../index');

	function _serve_hive(hive){
		hive.serve(app);
	}

	mvc.on('hive', _serve_hive);

	_.each(mvc.Hives.list.all(), _serve_hive);

};