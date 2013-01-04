var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var actions_loader = require('./../loaders/actions_loader');
var _DEBUG = false;


/**
 *
 * this handler searches for an actions folder. Note the folder must END in actions, but can have any
 * prefix you want, if a hive has multiple actions.
 *
 * It is usually attached to a hive.
 *
 */

module.exports = function () {

	var _mixins = {
		name:    'actions_dir_handler',
		respond: function (params) {
			if (_DEBUG) console.log('actions_handler: found actions folder %s', params.file_path);
			var apiary = handler.core();

			var hive = this;
			var loader = actions_loader(apiary, params.file_path, hive);
			loader.core(handler.core());

			var l = params.gate.latch();
			var tto = setTimeout(function(){
				console.log('hanging action %s', params.file_path);
			}, 2000);

			loader.load(function(){
				clearTimeout(tto);
				if (_DEBUG) console.log('done with actions dir for hive %s', hive.get_config('root'));
				l();
			}, params.file_path);
		}
	};

	var handler =  hive_loader.handler(
		 _mixins,
		[{
			dir: true,
			name_filter: /(.*)(_)?actions$/i
		}]);

	return handler;
};