var hl = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var Hive = require('./../hive');

var _mixins = {
	name:    'action_dir_handler',
	respond: function (params) {
		if (_DEBUG) {
			console.log('loading hive %s', params.file_path);
		}

		var l = params.gate.latch();
		var self = this;
		//console.log('hive_handler self == %s', util.inspect(self));
		Hive({}, {root: params.file_path}, function(err, hv){
			self.hives.push(hv);
			hv.init(function(){
				l()
			})
		})

	}
};

/**
 * This handler detects individual hives and launches a hive loader.
 *
 * it is usually attached to an hives loader.
 *
 * @param mixins
 * @param config
 * @param cb
 *
 * @return Handler
 */
module.exports = function (mixins, config, cb) {

	return hl.handler(
		[_mixins, mixins],
		[
			{
				dir:         true,
				name_filter: /(.*)(_hive)?$/
			},
			// handles any folder found in an actions folder; ideally, suffixed with _action
			config
		],
		cb);
};