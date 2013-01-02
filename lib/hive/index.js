var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var Component = require('hive-component');
var _mixins = require('./mixins');
var _DEBUG = false;

function _load(cb) {
	this.load(cb);
}


/** *******************************************
 *
 * this is a mixin that embeds a Hive factory into the apiary.
 *
 * @param apiary: Apiary
 * @param callback: function
 */

module.exports = function (apiary, callback) {

	function _emit(cb) {
		if (_DEBUG) console.log('emitting hive %s', this.get_config('root'))
		apiary.emit('hive', this);
		cb();
	}


	function _enlist(cb) {
		if (_DEBUG) console.log('enlisting hive %s', this.get_config('root'))

		var root = this.get_config('root');

		var existing_hive = Hive.list.get(root);
		if (existing_hive) {
			throw new Error('redundant hive for root %s', root);
		}

		Hive.list.put(this, function(){
			cb();
		});
	}

	function Hive(mixins, config) {
		if (_.isString(config)) {
			config = {
				root: config
			};
		}

		return Component([mixins, _mixins], [config, {apiary: apiary, init_tasks: [
			_load,
			_enlist,
			_emit
		]}]);
	}

	Hive.list = apiary.Model({name: '$hives', _pk: '$root'}, {}, function (){
		apiary.Hive = Hive;
		callback();
	});


};