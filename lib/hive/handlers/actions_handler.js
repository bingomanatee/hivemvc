var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var actions_loader = require('./../loaders/actions_loader');

var _mixins = {
	name:    'actions_dir_handler',
	respond: function (params) {
		console.log('actions_handler: found actions folder %s', params.file_path);
		var latch = params.gate.latch();
		var self = this;
		actions_loader(function(err, al){
			console.log('action loader created in actions_handler for %s: %s',params.file_path, self.get_config('root'));
			al.set_config('target', self);
			al.load(latch, params.file_path)
		});
	}
};

/**
 *
 * this handler searches for an actions folder. Note the folder must END in actions, but can have any
 * prefix you want, if a hive has multiple actions.
 *
 * It is usually attached to a hive.
 *
 */

module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		 [_mixins, mixins],
		[{
			dir: true,
			name_filter: /(.*)(_)?actions$/i
		}, config],
		cb);
}