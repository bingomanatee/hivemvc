var Component = require("hive-component");
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var events = require('events');
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
 * note: you must init() a model for it to be listed in the module.exports.list model.
 *
 * @param mixin
 * @param config
 * @param cb
 * @return Component(<model>)
 * @constructor
 *
 */

function Model(mixin, config, dataspace, callback) {
	if (!dataspace.type == 'dataspace'){
		throw new Error('bad dataspace passed');
	}

	var model = Component([
		{ TYPE: 'model'},
		mixin,
		_mixin
	], [config, {
		dataspace: dataspace,
		init_tasks: [
			_index_records,
		    function(cb){
			    this.get_config('dataspace').add(this);
			    cb();
		    }
		]
	}]);
	model.init(callback ? callback : _.identity);
	return model;
};

Model.Dataspace = require('./dataspace');

Model.model = function(dataspace){
	return function(mixin, config, callback){
		return Model(mixin, config, dataspace, callback);
	}
};

module.exports = Model;