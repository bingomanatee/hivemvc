var Component = require("hive-component");
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');

var _mixin = require('./mixins');

function _index_records(cb) {
	var self = this;
	var data = this.data;
	//console.log('init tasks for %s', util.inspect(this));
	this.data = [];
	_.each(data, function (record) {
		self.put(record); // adds to index, ensures ID
	});
	cb();
}

/**
 * Note - your app doesn't (and probably shouldn't) use Model
 * as a basis for data management in your app; they are used here and there
 * to warehouse internal resources.
 *
 * However, you should register any custom model classes with the list
 * property of this module, and they should have a unique name property
 * to serve as their key in that collection.
 *
 * @param mixin
 * @param config
 * @param cb
 * @return Component(<model>)
 * @constructor
 *
 */

function Model(mixin, config, cb) {
	var model = Component([
		{ TYPE: 'model'},
		mixin,
		_mixin
	], [config, {
		pk: 'id', init_tasks: [_index_records,
			function (cb) {
				if (module.exports.list){
					module.exports.list[this.name] = this;
				}
				cb();
			}
		]
	}], cb);
	return model;
};
module.exports = Model;

Model({
		name: '__model_index'
	},
	{_pk: 'name'},
	function (err, model_list) {
		model_list.init(function () {
			module.exports.list = model_list;
		});
	});